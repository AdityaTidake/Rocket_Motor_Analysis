import { useState } from "react";
import Plot from "./PlotlyChart";

export default function SimChart({ time, altitude, velocity, acceleration }) {
  const [tab, setTab] = useState("altitude");

  const dataMap = {
    altitude: { y: altitude, label: "Altitude (m)", color: "#27ae60" },
    velocity: { y: velocity, label: "Velocity (m/s)", color: "#2980b9" },
    acceleration: {
      y: acceleration,
      label: "Acceleration (m/s²)",
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
            line: { color: current.color, width: 2 },
          },
        ]}
        layout={{
          title: `${current.label} vs Time`,
          xaxis: { title: "Time (s)" },
          yaxis: { title: current.label },
          margin: { t: 40, r: 20, b: 50, l: 70 },
          autosize: true,
        }}
        useResizeHandler
        style={{ width: "100%", height: "340px" }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}
