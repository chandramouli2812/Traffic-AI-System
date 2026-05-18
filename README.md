````md
# Traffic AI System

An AI-powered traffic forecasting and mobility optimization platform built using FastAPI, React, Prophet, ARIMA, and Machine Learning.

The system helps:
- Forecast future traffic volume
- Detect traffic anomalies
- Generate congestion-based mobility recommendations
- Simulate traffic impact scenarios
- Visualize analytics through an interactive dashboard

---

# Project Overview

This project combines:
- FastAPI backend APIs
- React frontend dashboard
- Machine Learning forecasting models
- Traffic anomaly detection
- Simulation and optimization modules

The platform is designed for:
- Smart city applications
- Urban traffic monitoring
- Mobility optimization
- Transportation analytics
- AI-based congestion prediction

---

# Tech Stack

## Backend
- FastAPI
- Python
- Pandas
- Prophet
- Statsmodels
- Scikit-learn
- Uvicorn
- Joblib

## Frontend
- React.js
- Axios
- Chart.js
- React ChartJS 2

## Machine Learning
- Prophet Forecasting
- ARIMA / SARIMAX
- Isolation Forest

---

# Repository Structure

```text
traffic-ai-system/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── forecasting.py
│   │   ├── anomaly.py
│   │   ├── optimizer.py
│   │   ├── simulation.py
│   │   ├── utils.py
│   │   └── __init__.py
│   │
│   ├── datasets/
│   │   └── traffic.csv
│   │
│   ├── trained_models/
│   │   └── traffic_model.pkl
│   │
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadDataset.js
│   │   │   ├── ForecastChart.js
│   │   │   ├── AnomalyDetection.js
│   │   │   ├── RecommendationPanel.js
│   │   │   ├── SimulationPanel.js
│   │   │   └── Navbar.js
│   │   │
│   │   ├── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   │
│   ├── package.json
│   └── README.md
│
└── README.md
````

---

# Core Features

## 1. Traffic Forecasting

Predict future traffic volume using:

* Prophet
* ARIMA
* SARIMAX fallback

### Forecast Capabilities

* Hourly traffic prediction
* Daily congestion prediction
* Future trend analysis
* Seasonal traffic behavior

---

## 2. Anomaly Detection

Detect unusual traffic patterns using:

* Isolation Forest

### Examples

* Sudden congestion spikes
* Unexpected low traffic
* Event-based anomalies
* Sensor irregularities

---

## 3. Mobility Recommendations

Generate AI-based recommendations:

* Alternative route suggestions
* Congestion warnings
* Smart traffic advisory
* Peak-hour optimization

---

## 4. Traffic Simulation

Simulate:

* Traffic increase scenarios
* Accident impact
* Event traffic surge
* Weather impact

---

## 5. Interactive Dashboard

Frontend dashboard includes:

* Forecast charts
* Upload controls
* Simulation forms
* Recommendation cards
* Anomaly visualization

---

# Dataset Format

The uploaded CSV dataset should contain:

| Column Name      | Description                   |
| ---------------- | ----------------------------- |
| timestamp        | Date and time                 |
| vehicle_count    | Number of vehicles            |
| avg_speed        | Average vehicle speed         |
| congestion_level | Traffic congestion percentage |
| weather          | Weather condition             |
| route_id         | Route identifier              |
| incident         | Traffic incident flag         |
| holiday          | Holiday indicator             |

---

# Sample Dataset

```csv
timestamp,vehicle_count,avg_speed,congestion_level,weather,route_id,incident,holiday
2026-01-01 08:00:00,120,45,30,Sunny,R1,0,0
2026-01-01 09:00:00,180,35,60,Rainy,R1,1,0
2026-01-01 10:00:00,210,28,75,Cloudy,R2,0,0
```

---

# Backend Setup

## Step 1: Navigate to Backend

```powershell
cd D:\Stackly-Project\traffic-ai-system\backend
```

---

## Step 2: Create Virtual Environment

```powershell
python -m venv venv
```

Activate virtual environment:

### Windows

```powershell
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

---

## Step 3: Install Dependencies

```powershell
pip install -r requirements.txt
```

---

# Required Backend Dependencies

```txt
fastapi
uvicorn
pandas
numpy
scikit-learn
prophet
statsmodels
joblib
python-multipart
matplotlib
plotly
```

---

# Start Backend Server

```powershell
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger API Docs:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

## Step 1: Navigate to Frontend

```powershell
cd D:\Stackly-Project\traffic-ai-system\frontend
```

---

## Step 2: Install Packages

```powershell
npm install
```

---

## Step 3: Start React App

```powershell
npm start
```

Frontend URL:

```text
http://localhost:3000
```

---

# API Endpoints

## Home Endpoint

```http
GET /
```

Response:

```json
{
  "message": "AI Traffic Forecasting API Running"
}
```

---

## Upload Dataset

```http
POST /upload-dataset
```

Upload CSV file.

---

## Train Forecast Model

```http
POST /train-model
```

Trains Prophet or ARIMA model.

---

## Generate Forecast

```http
GET /forecast?hours=24
```

Example Response:

```json
{
  "forecast": [120, 130, 140, 160]
}
```

---

## Detect Anomalies

```http
GET /detect-anomalies
```

---

## Mobility Recommendation

```http
GET /recommendation?congestion=75
```

Example Response:

```json
{
  "recommendation": "Use alternate routes due to heavy congestion."
}
```

---

## Traffic Simulation

```http
POST /simulate
```

Parameters:

* base_traffic
* impact_factor

---

# Forecasting Workflow

```text
Dataset Upload
      ↓
Data Cleaning
      ↓
Feature Engineering
      ↓
Prophet Model Training
      ↓
Fallback to ARIMA if Prophet Fails
      ↓
Model Saving
      ↓
Forecast Generation
```

---

# Prophet Optimization Failure Handling

Sometimes Prophet fails on:

* Small datasets
* Invalid timestamps
* Missing values
* Windows + Python 3.14 compatibility

The project automatically falls back to:

* ARIMA
* SARIMAX

This improves reliability and prevents API crashes.

---

# Common Errors & Fixes

---

## Error 1

```text
ModuleNotFoundError: No module named 'forecasting'
```

### Fix

Use:

```python
from app.forecasting import train_forecast_model
```

instead of:

```python
from forecasting import train_forecast_model
```

---

## Error 2

```text
pandas.errors.EmptyDataError
```

### Cause

CSV file is empty.

### Fix

Upload a valid CSV with proper columns.

---

## Error 3

```text
RuntimeError: Error during optimization
```

### Cause

Prophet optimization failed.

### Fix

Fallback to ARIMA model.

---

# Recommended Python Version

Recommended:

```text
Python 3.11
```

Avoid:

* Python 3.14 for Prophet projects

---

# Future Enhancements

* Live traffic API integration
* Google Maps integration
* Real-time forecasting
* Deep Learning models (LSTM)
* Kafka streaming
* Docker deployment
* Cloud deployment
* Role-based authentication
* Advanced analytics dashboard

---

# Machine Learning Models

| Model            | Purpose                 |
| ---------------- | ----------------------- |
| Prophet          | Time-series forecasting |
| ARIMA            | Forecast fallback       |
| SARIMAX          | Seasonal forecasting    |
| Isolation Forest | Anomaly detection       |

---

# Frontend Dashboard Modules

| Component           | Purpose             |
| ------------------- | ------------------- |
| UploadDataset       | Upload CSV datasets |
| ForecastChart       | Display forecasts   |
| AnomalyDetection    | Show anomalies      |
| RecommendationPanel | AI recommendations  |
| SimulationPanel     | Traffic simulation  |

---

# Example Forecast Output

```json
{
  "future_predictions": [
    {
      "timestamp": "2026-05-20 10:00:00",
      "predicted_traffic": 145
    },
    {
      "timestamp": "2026-05-20 11:00:00",
      "predicted_traffic": 158
    }
  ]
}
```

---

# Development Notes

Backend development files:

```text
backend/app/
```

Frontend development files:

```text
frontend/src/components/
```

---

# Deployment Suggestions

## Backend

* Render
* Railway
* AWS EC2
* Azure

## Frontend

* Vercel
* Netlify

---

# Contributors

Developed for:

* AI Traffic Forecasting
* Smart Mobility Systems
* Transportation Intelligence

---

# License

This project currently does not include a license.

You may add:

* MIT License
* Apache 2.0
* GPL License

depending on your distribution needs.

---

# Author

AI Traffic Forecasting & Mobility Optimization System

Built using:

* FastAPI
* React
* Machine Learning
* Time Series Forecasting
* AI Analytics

```
```
