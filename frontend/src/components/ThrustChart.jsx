import Plot from './PlotlyChart'

export default function ThrustChart({ time, thrust, idealCurve }) {
  const xAxisTitle = 'Time (s)'
  const yAxisTitle = 'Thrust (N)'

  const traces = [
    {
      x: time,
      y: thrust,
      type: 'scatter',
      mode: 'lines',
      name: 'Measured Thrust',
      line: { color: '#e94560', width: 2 },
      hovertemplate: `${xAxisTitle}: %{x}<br>${yAxisTitle}: %{y}<extra></extra>`,
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
      hovertemplate: `${xAxisTitle}: %{x}<br>${yAxisTitle}: %{y}<extra></extra>`,
    })
  }

  return (
    <Plot
      data={traces}
      layout={{
        title: 'Thrust vs Time',
        xaxis: {
          title: { text: xAxisTitle, standoff: 14 },
          automargin: true,
        },
        yaxis: {
          title: { text: yAxisTitle, standoff: 18 },
          automargin: true,
        },
        margin: { t: 40, r: 20, b: 70, l: 80 },
        legend: { orientation: 'h', y: -0.2 },
        autosize: true,
      }}
      useResizeHandler
      style={{ width: '100%', height: '340px' }}
      config={{ displayModeBar: false }}
    />
  )
}
