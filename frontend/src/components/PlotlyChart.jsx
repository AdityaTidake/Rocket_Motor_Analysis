import { useState, useEffect, useRef } from 'react'

// Dynamically load Plotly to avoid Vite/CJS bundling issues
export default function Plot({ data, layout, style, config }) {
  const ref = useRef(null)
  const [Plotly, setPlotly] = useState(null)

  useEffect(() => {
    import('plotly.js-dist-min').then(mod => setPlotly(mod.default ?? mod))
  }, [])

  useEffect(() => {
    if (!Plotly || !ref.current) return
    Plotly.newPlot(ref.current, data, layout, { responsive: true, ...config })
    return () => Plotly.purge(ref.current)
  }, [Plotly, data, layout, config])

  return <div ref={ref} style={style} />
}
