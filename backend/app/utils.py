import os
import pandas as pd

MODEL_FOLDER = "trained_models"
DEFAULT_MODEL_PATH = os.path.join(MODEL_FOLDER, "traffic_forecast_model.pkl")


def ensure_model_folder():
    os.makedirs(MODEL_FOLDER, exist_ok=True)


def route_model_path(route_id=None):
    ensure_model_folder()

    if route_id:
        safe_id = ''.join(c for c in route_id if c.isalnum() or c in ('_', '-')).lower()
        return os.path.join(MODEL_FOLDER, f"traffic_forecast_model_{safe_id}.pkl")

    return DEFAULT_MODEL_PATH


def load_traffic_data(csv_path, route_id=None):
    df = pd.read_csv(csv_path, parse_dates=['timestamp'])
    df = df.sort_values('timestamp')

    if 'route_id' in df.columns and route_id:
        df = df[df['route_id'] == route_id].copy()

    if df.empty:
        raise ValueError('No traffic data found for the requested dataset or route.')

    df = df.ffill().bfill()
    return df


def prepare_forecast_dataframe(df):
    if 'route_id' in df.columns:
        df = df.groupby('timestamp', as_index=False).agg({
            'vehicle_count': 'sum',
            'avg_speed': 'mean',
            'congestion_level': 'mean'
        })

    df = df.rename(columns={'timestamp': 'ds', 'vehicle_count': 'y'})
    return df[['ds', 'y']]
