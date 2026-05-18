import os
import joblib
import pandas as pd
from prophet import Prophet
from statsmodels.tsa.statespace.sarimax import SARIMAX
from app.utils import load_traffic_data, prepare_forecast_dataframe, route_model_path


def _train_prophet(training_df):
    model = Prophet(
        seasonality_mode='additive',
        daily_seasonality=True,
        weekly_seasonality=True,
        yearly_seasonality=False,
        changepoint_prior_scale=0.05
    )
    model.add_seasonality(name='daily', period=24, fourier_order=10)
    model.fit(training_df)
    return model


def _train_arima(training_df):
    sarimax = SARIMAX(
        training_df['y'],
        order=(1, 1, 1),
        seasonal_order=(1, 1, 1, 24),
        enforce_stationarity=False,
        enforce_invertibility=False
    )
    fitted = sarimax.fit(disp=False)
    return fitted


def train_forecast_model(csv_path, route_id=None):
    df = load_traffic_data(csv_path, route_id)
    training_df = prepare_forecast_dataframe(df)

    training_df = training_df.sort_values('ds')
    training_df['y'] = training_df['y'].ffill().bfill()

    try:
        model = _train_prophet(training_df)
        model_type = 'prophet'
    except Exception:
        model = _train_arima(training_df)
        model_type = 'arima'

    last_timestamp = training_df['ds'].max()
    model_path = route_model_path(route_id)
    joblib.dump({
        'model': model,
        'model_type': model_type,
        'last_timestamp': last_timestamp
    }, model_path)

    return {
        'message': 'Forecast model trained successfully',
        'model_type': model_type,
        'model_path': model_path
    }


def generate_forecast(hours=24, route_id=None):
    model_path = route_model_path(route_id)

    if not os.path.exists(model_path):
        train_forecast_model('datasets/traffic.csv', route_id)

    wrapper = joblib.load(model_path)

    if isinstance(wrapper, dict):
        model = wrapper['model']
        model_type = wrapper.get('model_type', 'prophet')
        last_timestamp = wrapper['last_timestamp']
    else:
        train_forecast_model('datasets/traffic.csv', route_id)
        wrapper = joblib.load(model_path)
        model = wrapper['model']
        model_type = wrapper.get('model_type', 'prophet')
        last_timestamp = wrapper['last_timestamp']

    start = last_timestamp + pd.Timedelta(hours=1)
    forecast_index = pd.date_range(start=start, periods=hours, freq='h')

    if model_type == 'prophet':
        future = pd.DataFrame({'ds': forecast_index})
        forecast_df = model.predict(future)
        result_rows = forecast_df[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
        result = [
            {
                'ds': row['ds'].strftime('%Y-%m-%d %H:%M:%S'),
                'yhat': float(row['yhat']),
                'yhat_lower': float(row['yhat_lower']),
                'yhat_upper': float(row['yhat_upper'])
            }
            for _, row in result_rows.iterrows()
        ]
    else:
        forecast_result = model.get_forecast(steps=hours)
        summary = forecast_result.summary_frame(alpha=0.05)
        result = [
            {
                'ds': ts.strftime('%Y-%m-%d %H:%M:%S'),
                'yhat': float(summary['mean'].iloc[i]),
                'yhat_lower': float(summary['mean_ci_lower'].iloc[i]),
                'yhat_upper': float(summary['mean_ci_upper'].iloc[i])
            }
            for i, ts in enumerate(forecast_index)
        ]

    return result
