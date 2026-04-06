import Plot from './PlotlyChart'

export default function ThrustChart({ time, thrust, idealCurve }) {
  const traces = [
    {
      x: time,
      y: thrust,
      type: 'scatter',
      mode: 'lines',
      name: 'Measured Thrust',
      line: { color: '#e94560', width: 2 },
    },
  ]

  if (idealCurve && idealCurve.length === time.length) {
    traces.push({
      x: time,
      y: idealCurve,
      type: 'scatter',
      mode: 'lines',
      name: 'Best Fit Curve',
      line: { color: '#3b4cca', width: 2, dash: 'dash' },
    })
  }

  return (
    <Plot
      data={traces}
      layout={{
        title: 'Thrust vs Time',
        xaxis: { title: 'Time (s)' },
        yaxis: { title: 'Thrust (N)' },
        margin: { t: 40, r: 20, b: 50, l: 60 },
        legend: { orientation: 'h', y: -0.2 },
        autosize: true,
      }}
      useResizeHandler
      style={{ width: '100%', height: '340px' }}
      config={{ displayModeBar: false }}
    />
  )
}
