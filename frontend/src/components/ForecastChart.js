import React, { useEffect, useMemo, useState } from 'react'
import { API } from '../api'
import {
  Line
} from 'react-chartjs-2'
import 'chart.js/auto'

function ForecastChart({ modelTrained, refreshKey }) {

  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    if (modelTrained) {
      loadForecast()
    }
  }, [modelTrained, refreshKey])

  const loadForecast = async () => {
    setLoading(true)
    try {
      const response = await API.get('/forecast?hours=24')
      setForecast(response.data.forecast || [])
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Forecast load failed', error)
      setForecast([])
    } finally {
      setLoading(false)
    }
  }


  const data = useMemo(() => ({
    labels: forecast.map(item => item.ds),
    datasets: [
      {
        label: 'Predicted Traffic',
        data: forecast.map(item => item.yhat),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.18)',
        fill: true,
        tension: 0.32,
        pointRadius: 2,
        pointBorderColor: '#38bdf8',
        pointBackgroundColor: '#ffffff',
        borderWidth: 3,
      }
    ]
  }), [forecast])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          boxWidth: 12,
          boxHeight: 12,
          padding: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(56, 189, 248, 0.35)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.18)',
        },
        ticks: {
          color: '#cbd5e1',
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.18)',
        },
        ticks: {
          color: '#cbd5e1',
        },
      },
    },
  }), [])

  if (!modelTrained) {
    return (
      <div className="panel-section chart-pending" id="forecast">
        <div>
          <h2>Traffic Forecast</h2>
          <p className="chart-details">Train the model to activate the production forecast chart and display fresh predictions.</p>
          <button className="train-button" disabled>
            Awaiting training
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="panel-section" id="forecast">
      <div className="panel-heading-row">
        <h2>Traffic Forecast</h2>
        <button className="refresh-button" onClick={loadForecast} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <p className="refresh-status">
        {lastUpdated ? `Last refreshed ${lastUpdated.toLocaleTimeString()}` : 'No refresh yet.'}
      </p>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}

export default ForecastChart