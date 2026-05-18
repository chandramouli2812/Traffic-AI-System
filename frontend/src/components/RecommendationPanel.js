import React, { useState } from 'react'
import { API } from '../api'

function RecommendationPanel({ onUpdateRecommendation }) {
  const [congestion, setCongestion] = useState(0.5)
  const [routeId, setRouteId] = useState('A1')
  const [hour, setHour] = useState(8)
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const requestRecommendation = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await API.post('/recommendation', {
        congestion: Number(congestion),
        route_id: routeId,
        hour: Number(hour)
      })

      const recommendationValue = response.data.recommendation
      setRecommendation(recommendationValue)
      if (onUpdateRecommendation) {
        const summaryText = typeof recommendationValue === 'string'
          ? recommendationValue
          : JSON.stringify(recommendationValue)
        onUpdateRecommendation(summaryText)
      }
    } catch (err) {
      console.error('Recommendation failed', err)
      setRecommendation(null)
      setError('Unable to load recommendation. Check input values or API status.')
      if (onUpdateRecommendation) {
        onUpdateRecommendation('Recommendation unavailable')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel-section" id="recommendation">
      <div className="panel-heading-row">
        <h2>Mobility Recommendation</h2>
        <button className="refresh-button" onClick={requestRecommendation} disabled={loading}>
          {loading ? 'Calculating...' : 'Get Recommendation'}
        </button>
      </div>

      <div className="recommendation-form">
        <label>
          Congestion level
          <input
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={congestion}
            onChange={(e) => setCongestion(e.target.value)}
          />
        </label>
        <label>
          Route ID
          <input
            type="text"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
          />
        </label>
        <label>
          Hour of day
          <input
            type="number"
            min="0"
            max="23"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
          />
        </label>
      </div>

      {error && <p className="error-text">{error}</p>}

      {recommendation && (
        <div className="recommendation-result">
          <h3>Recommended actions</h3>
          <p>{typeof recommendation === 'string' ? recommendation : JSON.stringify(recommendation)}</p>
        </div>
      )}
    </div>
  )
}

export default RecommendationPanel
