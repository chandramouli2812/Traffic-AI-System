from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
import shutil
import os
import logging

from app.forecasting import train_forecast_model, generate_forecast
from app.anomaly import detect_anomalies
from app.optimizer import mobility_recommendation
from app.simulation import simulate_traffic


# =====================================================
# LOGGING CONFIGURATION
# =====================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# =====================================================
# FASTAPI INITIALIZATION
# =====================================================

app = FastAPI(
    title="AI Traffic Forecasting API",
    description="AI-powered Traffic Volume Forecasting & Mobility Optimization System",
    version="1.0.0"
)


# =====================================================
# CORS CONFIGURATION
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# FOLDERS & PATHS
# =====================================================

UPLOAD_FOLDER = "datasets"
DATASET_PATH = os.path.join(UPLOAD_FOLDER, "traffic.csv")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# =====================================================
# PYDANTIC MODELS
# =====================================================

class SimulationRequest(BaseModel):
    base_traffic: int
    impact_factor: float
    scenario: str = "weather"


class RecommendationRequest(BaseModel):
    congestion: float
    route_id: str | None = None
    hour: int | None = None


# =====================================================
# HOME ROUTE
# =====================================================

@app.get("/")
def home():
    return {
        "message": "AI Traffic Forecasting API Running"
    }


# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# =====================================================
# DATASET UPLOAD
# =====================================================

@app.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):

    try:

        if not file.filename.endswith(".csv"):
            raise HTTPException(
                status_code=400,
                detail="Only CSV files are allowed"
            )

        file_path = DATASET_PATH

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        logger.info(f"Dataset uploaded: {file.filename}")

        return {
            "message": "Dataset uploaded successfully",
            "path": file_path
        }

    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =====================================================
# TRAIN MODEL
# =====================================================

@app.post("/train-model")
async def train_model(route_id: str = None):

    try:

        if not os.path.exists(DATASET_PATH):
            raise HTTPException(
                status_code=404,
                detail="Dataset not found"
            )

        logger.info("Model training started")

        await run_in_threadpool(
            train_forecast_model,
            DATASET_PATH,
            route_id
        )

        logger.info("Model training completed")

        return {
            "message": "Forecast model trained successfully",
            "route_id": route_id or "all"
        }

    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =====================================================
# FORECAST TRAFFIC
# =====================================================

@app.get("/forecast")
def forecast(hours: int = 24, route_id: str = None):

    try:

        result = generate_forecast(hours, route_id)

        return {
            "status": "success",
            "forecast": result
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Forecast model not found"
        )

    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =====================================================
# ANOMALY DETECTION
# =====================================================

@app.get("/detect-anomalies")
def anomalies(route_id: str = None):

    try:

        result = detect_anomalies(DATASET_PATH, route_id)

        return {
            "status": "success",
            "anomalies": result
        }

    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =====================================================
# MOBILITY RECOMMENDATION
# =====================================================

@app.post("/recommendation")
def recommendation(data: RecommendationRequest):

    try:

        result = mobility_recommendation(
            data.congestion,
            data.route_id,
            data.hour
        )

        return {
            "status": "success",
            "recommendation": result
        }

    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =====================================================
# TRAFFIC SIMULATION
# =====================================================

@app.post("/simulate")
def simulate(data: SimulationRequest):

    try:

        result = simulate_traffic(
            data.base_traffic,
            data.impact_factor,
            data.scenario
        )

        return {
            "status": "success",
            "simulation": result
        }

    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )