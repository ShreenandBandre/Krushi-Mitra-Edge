import os
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, IsolationForest

MODEL_PATH        = os.path.join(os.path.dirname(__file__), "models", "irrigation_model.pkl")
ANOMALY_MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "anomaly_model.pkl")

CROP_PROFILES = {
    "wheat":     {"min_moisture": 50, "max_temp": 35},
    "rice":      {"min_moisture": 70, "max_temp": 38},
    "cotton":    {"min_moisture": 40, "max_temp": 40},
    "sugarcane": {"min_moisture": 60, "max_temp": 38},
    "tomato":    {"min_moisture": 50, "max_temp": 33},
}

def get_crop_profile(crop: str) -> dict:
    return CROP_PROFILES.get(crop.lower(), CROP_PROFILES["wheat"])

# ── Training ───────────────────────────────────────────────────────────────

def train_models():
    """Train on synthetic data. Replace with Kaggle dataset later."""
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    np.random.seed(42)
    n = 3000

    soil     = np.random.uniform(10, 100, n)
    temp     = np.random.uniform(15, 45,  n)
    humidity = np.random.uniform(20, 95,  n)

    # Ground truth: irrigate if dry soil or hot + moderately dry
    pump = ((soil < 45) | ((temp > 35) & (soil < 60))).astype(int)

    X = np.column_stack([soil, temp, humidity])

    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X, pump)
    joblib.dump(clf, MODEL_PATH)

    iso = IsolationForest(contamination=0.05, random_state=42)
    iso.fit(X)
    joblib.dump(iso, ANOMALY_MODEL_PATH)

    print("Models trained and saved.")
    return clf, iso

SCALER_PATH = os.path.join(os.path.dirname(__file__), "models", "scaler_bounds.pkl")

def load_models():
    if not os.path.exists(MODEL_PATH):
        return train_models()
    return joblib.load(MODEL_PATH), joblib.load(ANOMALY_MODEL_PATH)

def normalize_soil(raw_value: float) -> float:
    """Convert raw sensor reading to 0-100% using training data bounds."""
    if os.path.exists(SCALER_PATH):
        bounds = joblib.load(SCALER_PATH)
        pct = (raw_value - bounds["soil_min"]) / (bounds["soil_max"] - bounds["soil_min"]) * 100
        return float(np.clip(pct, 0, 100))
    return raw_value  # already normalized

# ── Inference ──────────────────────────────────────────────────────────────

def predict_irrigation(soil_moisture: float, temperature: float,
                       air_humidity: float, crop: str = "wheat") -> dict:
    clf, iso = load_models()
    profile  = get_crop_profile(crop)
    soil_pct = normalize_soil(soil_moisture)
    X        = np.array([[soil_pct, temperature, air_humidity]])

    decision   = int(clf.predict(X)[0])
    confidence = float(clf.predict_proba(X)[0][decision])
    is_anomaly = iso.predict(X)[0] == -1

    # Crop-aware override: skip irrigation if soil is already well above threshold
    if soil_pct > profile["min_moisture"] + 20:
        decision = 0

    # Crop-aware override: force irrigation if well below threshold
    if soil_pct < profile["min_moisture"] - 15:
        decision = 1

    alerts = []
    if temperature > profile["max_temp"]:
        alerts.append(f"Heat stress risk for {crop.title()} (Temp: {temperature}°C)")
    if air_humidity > 85:
        alerts.append("High humidity — fungal risk possible")
    if is_anomaly:
        alerts.append("Sensor anomaly detected — verify readings")

    return {
        "irrigate":    bool(decision),
        "confidence":  round(confidence, 2),
        "is_anomaly":  is_anomaly,
        "alerts":      alerts,
        "crop_profile": profile,
    }

def detect_pump_failure(pump_was_on: bool,
                        moisture_before: float,
                        moisture_after: float,
                        threshold: float = 2.0) -> bool:
    """Return True if pump ran but moisture did not increase meaningfully."""
    return pump_was_on and (moisture_after - moisture_before) < threshold
