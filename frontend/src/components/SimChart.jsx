import { useState } from "react";
import Plot from "./PlotlyChart";

export default function SimChart({ time, altitude, velocity, acceleration }) {
  const [tab, setTab] = useState("altitude");
  const xAxisTitle = "Time (s)";

  const dataMap = {
    altitude: {
      y: altitude,
      parameter: "Altitude",
      unit: "m",
      yAxisTitle: "Altitude (m)",
      color: "#27ae60",
    },
    velocity: {
      y: velocity,
      parameter: "Velocity",
      unit: "m/s",
      yAxisTitle: "Velocity (m/s)",
      color: "#2980b9",
    },
    acceleration: {
      y: acceleration,
      parameter: "Acceleration",
      unit: "m/s^2",
      yAxisTitle: "Acceleration (m/s^2)",
      color: "#e67e22",
    },
  };

  const current = dataMap[tab];

  return (
    <div>
      <div className="tab-bar">
        {Object.keys(dataMap).map((k) => (
          <button
            key={k}
            className={`tab-btn ${tab === k ? "active" : ""}`}
            onClick={() => setTab(k)}
          >
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>
      <Plot
        data={[
          {
            x: time,
            y: current.y,
            type: "scatter",
            mode: "lines",
            name: current.yAxisTitle,
            line: { color: current.color, width: 2 },
            hovertemplate: `${xAxisTitle}: %{x}<br>${current.parameter} (${current.unit}): %{y}<extra></extra>`,
          },
        ]}
        layout={{
          title: `${current.parameter} vs Time`,
          xaxis: {
            title: { text: xAxisTitle, standoff: 14 },
            automargin: true,
          },
          yaxis: {
            title: { text: current.yAxisTitle, standoff: 18 },
            automargin: true,
          },
          margin: { t: 40, r: 20, b: 70, l: 90 },
          autosize: true,
        }}
        useResizeHandler
        style={{ width: "100%", height: "340px" }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}
