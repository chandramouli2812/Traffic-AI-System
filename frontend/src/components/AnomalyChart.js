import React, { useCallback, useEffect, useState } from 'react'
import { API } from '../api'

function AnomalyChart({ onCountUpdate }) {

  const [anomalies, setAnomalies] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const getSeverity = (score) => {
    if (score >= 0.75) return 'critical'
    if (score >= 0.45) return 'warning'
    return 'info'
  }

  const loadAnomalies = useCallback(async () => {
    setLoading(true)
    try {
      const response = await API.get('/detect-anomalies')
      const anomaliesData = response.data.anomalies || []
      setAnomalies(anomaliesData)
      setLastUpdated(new Date())
      if (onCountUpdate) {
        onCountUpdate(anomaliesData.length)
      }
    } catch (error) {
      console.error('Anomaly load failed', error)
      setAnomalies([])
      if (onCountUpdate) {
        onCountUpdate(0)
      }
    } finally {
      setLoading(false)
    }
  }, [onCountUpdate])

  useEffect(() => {
    loadAnomalies()
  }, [loadAnomalies])

  return (
    <div className="panel-section" id="anomalies">
      <div className="panel-heading-row">
        <h2>Anomalies</h2>
        <button className="refresh-button" onClick={loadAnomalies} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <p className="refresh-status">
        {lastUpdated ? `Last refreshed ${lastUpdated.toLocaleTimeString()}` : 'No refresh yet.'}
      </p>
      {anomalies.length === 0 ? (
        <p>No anomaly events detected yet.</p>
      ) : (
        anomalies.map((item, index) => (
          <div className="anomaly-item" key={index}>
            <div className="anomaly-row">
              <strong>{item.timestamp}</strong>
              <span className={`anomaly-badge anomaly-${getSeverity(item.score || 0)}`}>
                {item.score ? `${Math.round(item.score * 100)}%` : 'Alert'}
              </span>
            </div>
            <p>Vehicle Count: {item.vehicle_count}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default AnomalyChart