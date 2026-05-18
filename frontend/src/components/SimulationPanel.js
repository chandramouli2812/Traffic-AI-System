import React, { useState } from 'react'
import { API } from '../api'

function SimulationPanel() {

  const [traffic, setTraffic] = useState(100)
  const [impact, setImpact] = useState(0.2)
  const [result, setResult] = useState(null)


  const simulate = async () => {
    try {
      const response = await API.post('/simulate', {
        base_traffic: Number(traffic),
        impact_factor: Number(impact),
        scenario: 'weather'
      })

      setResult(response.data.simulation || response.data)
    } catch (error) {
      console.error('Simulation failed', error)
      setResult(null)
    }
  }

  return (
    <div className="panel-section">
      <h2>Scenario Simulation</h2>

      <input
        type='number'
        value={traffic}
        onChange={(e) => setTraffic(e.target.value)}
        placeholder='Base traffic'
      />

      <input
        type='number'
        step='0.1'
        value={impact}
        onChange={(e) => setImpact(e.target.value)}
        placeholder='Impact factor'
      />

      <button onClick={simulate}>Run Simulation</button>

      {result && (
        <div className="result-block">
          <h3>Result</h3>
          <p>Estimated Traffic: {result.estimated_traffic}</p>
          <p>Estimated Delay: {result.estimated_delay}</p>
        </div>
      )}
    </div>
  )
}

export default SimulationPanel