import React, { useState } from 'react'
import { UploadDataset } from './components/UploadDataset'
import ForecastChart from './components/ForecastChart'
import AnomalyChart from './components/AnomalyChart'
import SimulationPanel from './components/SimulationPanel'
import RecommendationPanel from './components/RecommendationPanel'
import { API } from './api'
import './App.css'

function App() {
  const [alertCount, setAlertCount] = useState(0)
  const [modelStatus, setModelStatus] = useState('Ready')
  const [modelInfo, setModelInfo] = useState('Model is ready to train on uploaded traffic datasets.')
  const [lastTrained, setLastTrained] = useState(null)
  const [modelName] = useState('Traffic Volume Predictor')
  const [forecastTrigger, setForecastTrigger] = useState(0)
  const [modelTrained, setModelTrained] = useState(false)
  const [recommendationSummary, setRecommendationSummary] = useState('No recommendation loaded yet.')
  const [datasetInfo, setDatasetInfo] = useState({
    fileName: 'No dataset uploaded',
    fileSize: null,
    rowCount: null,
    columnCount: null,
    uploaded: false
  })

  const trainModel = async () => {
    setModelStatus('Training...')
    setModelInfo('Starting training on current dataset...')

    try {
      const response = await API.post('/train-model')
      const message = response.data?.message || 'Model trained successfully.'
      setModelStatus('Trained')
      setModelInfo(message)
      setLastTrained(new Date())
      setModelTrained(true)
      setForecastTrigger((prev) => prev + 1)
    } catch (error) {
      setModelStatus('Error')
      setModelInfo('Training failed. Check API and dataset.')
      console.error('Model training failed', error)
    }
  }

  const insightMessage = alertCount > 5
    ? 'Elevated anomaly risk detected across monitored routes.'
    : alertCount > 0
      ? 'Traffic behavior is active with moderate anomaly alerts.'
      : 'Traffic signals are stable with minimal anomalies.'

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <div className="nav-brand">TrafficAI</div>
        <div className="nav-links">
          <a href="#forecast">Forecast</a>
          <a href="#anomalies">Anomalies</a>
          <a href="#simulate">Simulation</a>
        </div>
        <div className="nav-actions">
          <span className="status-pill">Connected</span>
        </div>
      </nav>

      <header className="app-header">
        <div>
          <p className="eyebrow">AI Traffic & Mobility Intelligence</p>
          <h1>Traffic Forecasting Dashboard</h1>
          <p className="subtitle">
            Monitor traffic predictions, detect anomalies, and simulate route impact with a unified control panel.
          </p>
        </div>
        <div className="header-badge">
          <span>Live Traffic Insights</span>
          <strong>{alertCount} Alerts</strong>
          <span className="header-subtext">{recommendationSummary}</span>
        </div>
      </header>

      <section className="dashboard-grid summary-grid">
        <article className="metric-card">
          <span className="metric-label">Forecast Accuracy</span>
          <strong className="metric-value">92%</strong>
          <p className="metric-note">Rolling hourly and daily traffic prediction confidence.</p>
        </article>
        <article className="metric-card">
          <span className="metric-label">Model Name</span>
          <strong className="metric-value">{modelName}</strong>
          <p className="metric-note">Current forecasting model in use for traffic prediction.</p>
        </article>
        <article className="metric-card">
          <span className="metric-label">Anomaly Alerts</span>
          <strong className="metric-value">{alertCount} active</strong>
          <p className="metric-note">Detected spikes, drops, and behavior changes across routes.</p>
        </article>
        <article className="metric-card dataset-card">
          <span className="metric-label">Current Dataset</span>
          <strong className="metric-value">{datasetInfo.uploaded ? datasetInfo.fileName : 'No dataset uploaded'}</strong>
          <p className="metric-note">
            {datasetInfo.uploaded
              ? `${datasetInfo.rowCount ?? '—'} rows · ${datasetInfo.columnCount ?? '—'} columns · ${datasetInfo.fileSize}`
              : 'Upload a CSV file to enable forecast training and dataset insights.'}
          </p>
        </article>
      </section>

      <section className="dashboard-grid insights-grid">
        <div className="panel-card model-panel">
          <div className="panel-heading-row">
            <h2>Model Controls</h2>
            <button className="train-button" onClick={trainModel} disabled={modelStatus === 'Training...'}>
              {modelStatus === 'Training...' ? 'Training...' : 'Train Model'}
            </button>
          </div>
          <span className="metric-label">Model name</span>
          <strong className="metric-value">{modelName}</strong>
          <p className="metric-note">{modelInfo}</p>
          <p className="small-meta">Last trained: {lastTrained ? lastTrained.toLocaleString() : 'Not trained yet'}</p>
        </div>
        <div className="panel-card insights-panel">
          <div className="panel-heading-row">
            <h2>Operational Insights</h2>
          </div>
          <ul className="insights-list">
            <li>{insightMessage}</li>
            <li>{`Model status is currently ${modelStatus.toLowerCase()}.`}</li>
            <li>{`Real-time alert flow indicates ${alertCount > 3 ? 'heightened review' : 'normal operations'}.`}</li>
          </ul>
        </div>
      </section>

      <section className="dashboard-grid main-grid">
        <div className="panel-card panel-large">
          <ForecastChart modelTrained={modelTrained} refreshKey={forecastTrigger} />
        </div>
        <div className="panel-column">
          <div className="panel-card">
            <UploadDataset onDatasetUpload={setDatasetInfo} />
          </div>
          <div className="panel-card">
            <AnomalyChart onCountUpdate={setAlertCount} />
          </div>
          <div className="panel-card">
            <RecommendationPanel onUpdateRecommendation={setRecommendationSummary} />
          </div>
          <div className="panel-card" id="simulate">
            <SimulationPanel />
          </div>
        </div>
      </section>
    </div>
  )
}

export default App