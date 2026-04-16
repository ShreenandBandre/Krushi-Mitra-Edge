import sqlite3
import json
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import ai_engine

DB_FILE = "sensor_data.db"

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

# Initialize the database table when the script starts
init_db()

app = FastAPI(
    title="Krushi-Mitra-Edge AI Engine API",
    description="API for Agricultural predictions and diagnostics.",
    version="1.0.0"
)

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. For production, change to your frontend's specific URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

# --- Pydantic Models ---

class IrrigationRequest(BaseModel):
    soil_moisture: float
    temperature: float
    air_humidity: float
    crop: Optional[str] = "wheat"

class IrrigationResponse(BaseModel):
    irrigate: bool
    confidence: float
    is_anomaly: bool
    alerts: List[str]
    crop_profile: dict

class PumpDiagnosticRequest(BaseModel):
    pump_was_on: bool
    moisture_before: float
    moisture_after: float
    threshold: Optional[float] = 2.0

class PumpDiagnosticResponse(BaseModel):
    pump_failure_detected: bool

# --- Endpoints ---

@app.post("/api/predict", response_model=IrrigationResponse, summary="Predict Irrigation needs")
async def predict_irrigation(request: IrrigationRequest):
    """
    Predicts whether irrigation is needed based on sensor data and crop type.
    """
    try:
        result = ai_engine.predict_irrigation(
            soil_moisture=request.soil_moisture,
            temperature=request.temperature,
            air_humidity=request.air_humidity,
            crop=request.crop
        )
        
        # Save data and prediction to SQLite
        try:
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
                json.dumps(result.get("alerts", []))
            ))
            conn.commit()
            conn.close()
        except Exception as db_err:
            print(f"Database logging error: {db_err}")

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/diagnostics/pump", response_model=PumpDiagnosticResponse, summary="Detect Pump Failure")
async def check_pump_failure(request: PumpDiagnosticRequest):
    """
    Detects potential water pump failures or supply issues based on moisture change after pumping.
    """
    try:
        is_failure = ai_engine.detect_pump_failure(
            pump_was_on=request.pump_was_on,
            moisture_before=request.moisture_before,
            moisture_after=request.moisture_after,
            threshold=request.threshold
        )
        return {"pump_failure_detected": is_failure}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health", summary="Health Check")
async def health_check():
    """
    Simple health check to make sure the API is up and running.
    """
    return {"status": "healthy"}
