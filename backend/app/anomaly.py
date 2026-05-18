import pandas as pd
from sklearn.ensemble import IsolationForest
from app.utils import load_traffic_data


def detect_anomalies(csv_path, route_id=None):
    df = load_traffic_data(csv_path, route_id)
    features = df[['vehicle_count', 'avg_speed', 'congestion_level']].fillna(0)

    model = IsolationForest(contamination=0.03, random_state=42)
    model.fit(features)
    df['anomaly_score'] = model.decision_function(features)
    df['anomaly'] = model.predict(features)

    mean_count = df['vehicle_count'].mean()
    std_count = df['vehicle_count'].std()

    def classify(row):
        if row['vehicle_count'] > mean_count + 2 * std_count:
            return 'spike'
        if row['vehicle_count'] < mean_count - 2 * std_count:
            return 'drop'
        return 'behavior_change'

    df['anomaly_type'] = df.apply(classify, axis=1)
    anomalies = df[df['anomaly'] == -1].copy()
    anomalies['timestamp'] = anomalies['timestamp'].dt.strftime('%Y-%m-%d %H:%M:%S')

    return anomalies[['timestamp', 'route_id', 'vehicle_count', 'avg_speed', 'congestion_level', 'anomaly_score', 'anomaly_type']].to_dict(orient='records')
