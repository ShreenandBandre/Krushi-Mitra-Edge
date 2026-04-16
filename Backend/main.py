from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import ai_engine

app = FastAPI(
    title="Krushi-Mitra-Edge AI Engine API",
    description="API for Agricultural predictions and diagnostics.",
    version="1.0.0"
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
