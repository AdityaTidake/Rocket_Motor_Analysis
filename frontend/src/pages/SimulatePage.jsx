import { useState, useRef } from 'react'
import axios from 'axios'
import SimChart from '../components/SimChart'
import ErrorBoundary from '../components/ErrorBoundary'

export default function SimulatePage() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()

  const handleSimulate = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const text = await file.text()
      const lines = text.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const timeIdx = headers.indexOf('time')
      const thrustIdx = headers.indexOf('thrust')

      if (timeIdx === -1 || thrustIdx === -1) {
        setError('CSV must have "time" and "thrust" columns')
        setLoading(false)
        return
      }

      const thrust_curve = lines.slice(1).map(line => {
        const cols = line.split(',')
        return { time: parseFloat(cols[timeIdx]), thrust: parseFloat(cols[thrustIdx]) }
      }).filter(r => !isNaN(r.time) && !isNaN(r.thrust))

      const res = await axios.post('/simulate', { thrust_curve })

      if (res.data.status === 'error') {
        setError(res.data.message)
      } else {
        setResult(res.data.simulation)
      }
    } catch (e) {
      setError(e.message || 'Simulation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h2>Flight Simulation</h2>
        <p style={{ fontSize: '0.85rem', color: '#777', marginBottom: '16px' }}>
          Upload a thrust CSV to simulate altitude, velocity, and acceleration over time.
        </p>
        <div className="upload-area" onClick={() => inputRef.current.click()}>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={e => setFile(e.target.files[0])}
          />
          <span style={{ fontSize: '2rem' }}>📂</span>
          <p>Click to select a CSV file (columns: time, thrust)</p>
          {file && <div className="file-name">Selected: {file.name}</div>}
        </div>

        <div style={{ marginTop: '16px' }}>
          <button
            className="btn btn-primary"
            onClick={handleSimulate}
            disabled={!file || loading}
          >
            {loading ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>

        {loading && <div className="status-msg loading">Running simulation...</div>}
        {error && <div className="status-msg error">{error}</div>}
      </div>

      {result && (
        <div className="card">
          <h2>Simulation Results</h2>
          <ErrorBoundary>
            <SimChart
              time={result.time}
              altitude={result.altitude}
              velocity={result.velocity}
              acceleration={result.acceleration}
            />
          </ErrorBoundary>
        </div>
      )}
    </div>
  )
}
