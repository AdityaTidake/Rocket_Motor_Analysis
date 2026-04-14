import { useState, useEffect, useRef } from 'react'

// Dynamically load Plotly to avoid Vite/CJS bundling issues
export default function Plot({ data, layout, style, config }) {
  const ref = useRef(null)
  const [Plotly, setPlotly] = useState(null)

  useEffect(() => {
    import('plotly.js-dist-min').then(mod => setPlotly(mod.default ?? mod))
  }, [])

  useEffect(() => {
    const currentRef = ref.current;
    if (!Plotly || !currentRef) return;

    try {
      Plotly.newPlot(currentRef, data, layout, { responsive: true, ...config });
    } catch (e) {
      console.error("Plotly render error:", e);
    }

    return () => {
      try {
        if (currentRef) {
          Plotly.purge(currentRef);
        }
      } catch (e) {
        console.error("Plotly purge error:", e);
      }
    };
  }, [Plotly, data, layout, config])

  return <div ref={ref} style={style} />
}
