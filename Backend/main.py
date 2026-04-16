import sqlite3
import json
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import ai_engine

DB_FILE = "sensor_data.db"

# --- DB INIT ---
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            soil_moisture REAL,
            temperature REAL,
            air_humidity REAL,
            crop TEXT,
            irrigate BOOLEAN,
            confidence REAL,
            is_anomaly BOOLEAN,
            alerts TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# --- APP ---
app = FastAPI(
    title="Krushi-Mitra-Edge AI Engine API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- HELPERS ---
def normalize_result(result):
    return {
        "irrigate": bool(result["irrigate"]),
        "confidence": float(result["confidence"]),
        "is_anomaly": bool(result["is_anomaly"]),
        "alerts": list(result.get("alerts", [])),
        "crop_profile": dict(result.get("crop_profile", {}))
    }

def row_to_dict(row):
    profile = ai_engine.get_crop_profile(row[5])  # ✅ FIXED

    return {
        "id": row[0],
        "timestamp": row[1],
        "soil": row[2],
        "temperature": row[3],
        "humidity": row[4],
        "crop": row[5],
        "irrigate": bool(row[6]),
        "confidence": row[7],
        "is_anomaly": bool(row[8]),
        "alerts": json.loads(row[9]) if row[9] else [],
        "crop_profile": profile   # ✅ NOW WORKS
    }

# --- MODELS ---
class IrrigationRequest(BaseModel):
    soil_moisture: float
    temperature: float
    air_humidity: float
    crop: Optional[str] = "wheat"

class PumpDiagnosticRequest(BaseModel):
    pump_was_on: bool
    moisture_before: float
    moisture_after: float
    threshold: Optional[float] = 2.0

# --- CORE API ---
@app.post("/api/predict")
async def predict_irrigation(request: IrrigationRequest):
    try:
        raw = ai_engine.predict_irrigation(
            request.soil_moisture,
            request.temperature,
            request.air_humidity,
            request.crop
        )

        result = normalize_result(raw)

        # Safety override
        if result["is_anomaly"]:
            result["irrigate"] = False
            result["alerts"].append("Blocked due to anomaly")

        # Save to DB
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO predictions 
            (soil_moisture, temperature, air_humidity, crop, irrigate, confidence, is_anomaly, alerts)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            request.soil_moisture,
            request.temperature,
            request.air_humidity,
            request.crop,
            result["irrigate"],
            result["confidence"],
            result["is_anomaly"],
            json.dumps(result["alerts"])
        ))
        conn.commit()
        conn.close()

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- DASHBOARD APIs ---

@app.get("/api/latest")
def get_latest():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM predictions ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    return row_to_dict(row) if row else {}

@app.get("/api/history")
def get_history(limit: int = 50):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM predictions ORDER BY id DESC LIMIT {limit}")
    rows = cursor.fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows[::-1]]

@app.get("/api/stats")
def get_stats():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cursor.execute("SELECT AVG(soil_moisture), AVG(temperature), AVG(air_humidity) FROM predictions")
    avg = cursor.fetchone()

    cursor.execute("SELECT COUNT(*) FROM predictions WHERE irrigate=1")
    irrigations = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM predictions WHERE is_anomaly=1")
    anomalies = cursor.fetchone()[0]

    conn.close()

    return {
        "avg_soil": avg[0],
        "avg_temperature": avg[1],
        "avg_humidity": avg[2],
        "total_irrigations": irrigations,
        "anomalies_detected": anomalies
    }

@app.get("/api/analytics")
def get_analytics():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT timestamp, soil_moisture, temperature, air_humidity, crop
        FROM predictions ORDER BY id DESC LIMIT 20
    """)
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "time": r[0],
            "soil": r[1],
            "temp": r[2],
            "humidity": r[3],
            "crop": r[4],
            "crop_profile": ai_engine.get_crop_profile(r[4])  # ✅ added
        }
        for r in rows[::-1]
    ]

# --- PUMP ---
@app.post("/api/diagnostics/pump")
async def check_pump_failure(request: PumpDiagnosticRequest):
    is_failure = ai_engine.detect_pump_failure(
        request.pump_was_on,
        request.moisture_before,
        request.moisture_after,
        request.threshold
    )
    return {"pump_failure_detected": bool(is_failure)}

# --- HEALTH ---
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# --- INSIGHTS ---
@app.get("/api/insights")
def get_insights():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT timestamp, soil_moisture, temperature, air_humidity, irrigate
        FROM predictions ORDER BY id DESC LIMIT 10
    """)
    rows = cursor.fetchall()
    conn.close()

    if len(rows) < 2:
        return {"message": "Not enough data"}

    rows = rows[::-1]

    soils = [r[1] for r in rows]
    temps = [r[2] for r in rows]
    humidity = [r[3] for r in rows]

    # -------------------------
    # 🌱 DRYING ANALYSIS
    # -------------------------
    drying_rate = soils[0] - soils[-1]

    drying_status = (
        "FAST DRYING" if drying_rate > 10 else
        "MODERATE" if drying_rate > 5 else
        "STABLE"
    )

    # -------------------------
    # 🌡 STRESS ANALYSIS
    # -------------------------
    avg_temp = sum(temps) / len(temps)
    avg_hum = sum(humidity) / len(humidity)

    stress = (
        "HIGH" if avg_temp > 35 and avg_hum > 70 else
        "MEDIUM" if avg_temp > 30 else
        "LOW"
    )

    # -------------------------
    # 💧 IRRIGATION + WATER USAGE
    # -------------------------
    irrigations = sum([1 for r in rows if r[4]])
    water_used = irrigations * 10

    # -------------------------
    # 🚨 SMART ALERT SYSTEM (NEW 🔥)
    # -------------------------
    alerts = []

    # High priority alert
    if drying_rate > 10:
        alerts.append({
            "level": "HIGH",
            "message": "Soil drying fast — irrigate within 30 minutes"
        })

    # Heat stress alert
    if avg_temp > 35:
        alerts.append({
            "level": "MEDIUM",
            "message": "High temperature detected — avoid midday irrigation"
        })

    # Water usage alert
    if irrigations > 5:
        alerts.append({
            "level": "LOW",
            "message": "Frequent irrigation — consider reducing water usage"
        })

    # Default safe state
    if not alerts:
        alerts.append({
            "level": "LOW",
            "message": "All conditions are stable"
        })

    # -------------------------
    # 🤖 RECOMMENDATION (kept but improved tone)
    # -------------------------
    if drying_status == "FAST DRYING":
        recommendation = "Increase irrigation frequency immediately"
    elif stress == "HIGH":
        recommendation = "Avoid irrigation during peak heat hours"
    else:
        recommendation = "Conditions are stable"

    # -------------------------
    # 📦 RESPONSE
    # -------------------------
    return {
        "drying_rate": drying_rate,
        "drying_status": drying_status,
        "stress_level": stress,

        "avg_temp": avg_temp,
        "avg_humidity": avg_hum,

        "irrigation_count": irrigations,
        "water_estimate_liters": water_used,

        "recommendation": recommendation,

        "alerts": alerts
    }

@app.get("/api/water-efficiency")
def water_efficiency():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM predictions WHERE irrigate=1")
    total_irrigations = cursor.fetchone()[0]

    cursor.execute("""
        SELECT COUNT(*) FROM predictions 
        WHERE irrigate=1 AND soil_moisture < 40
    """)
    useful_irrigations = cursor.fetchone()[0]

    conn.close()

    if total_irrigations == 0:
        return {"efficiency": 0, "message": "No irrigation data"}

    efficiency = (useful_irrigations / total_irrigations) * 100

    if efficiency < 50:
        suggestion = "Too much water usage. Reduce frequency."
    elif efficiency < 75:
        suggestion = "Moderate efficiency. Can improve."
    else:
        suggestion = "Efficient irrigation 👍"

    return {
        "efficiency": efficiency,
        "total_irrigations": total_irrigations,
        "useful_irrigations": useful_irrigations,
        "suggestion": suggestion
    }

@app.get("/api/weekly-summary")
def weekly_summary():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT soil_moisture, irrigate, timestamp 
        FROM predictions
        WHERE timestamp >= datetime('now', '-7 days')
    """)
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return {"message": "No weekly data"}

    soils = [r[0] for r in rows]
    irrigations = sum([1 for r in rows if r[1]])

    avg_health = sum(soils) / len(soils)

    trend = "improving" if soils[-1] > soils[0] else "declining"

    return {
        "avg_health": avg_health,
        "total_irrigations": irrigations,
        "trend": trend,
        "summary": f"Health is {trend} this week"
    }