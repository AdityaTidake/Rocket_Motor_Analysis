import React, { useState } from "react";
import axios from "axios";
import Plot from "./PlotlyChart";

export default function MotorComparison() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file1 || !file2) {
      alert("Please upload both files");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("motor1", file1);
    formData.append("motor2", file2);

    try {
      const res = await axios.post("/compare-motors/", formData);
      if (res.data.error) {
        alert("Error: " + res.data.error);
        return;
      }
      setData(res.data);
    } catch (error) {
      console.error(error);
      alert("Error comparing motors: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getBestMotor = () => {
    if (!data) return null;
    const m1 = data.motor1.metrics;
    const m2 = data.motor2.metrics;
    let score1 = 0, score2 = 0;
    if (m1.max_thrust > m2.max_thrust) score1++; else score2++;
    if (m1.total_impulse > m2.total_impulse) score1++; else score2++;
    if (m1.burn_time > m2.burn_time) score1++; else score2++;
    if (score1 > score2) return { winner: "Motor 1", file: file1?.name, color: "#3b82f6" };
    if (score2 > score1) return { winner: "Motor 2", file: file2?.name, color: "#f97316" };
    return { winner: "Tie", file: null, color: "#a855f7" };
  };

  const best = getBestMotor();

  const MetricRow = ({ label, v1, v2, unit }) => {
    const better = v1 > v2 ? 1 : v2 > v1 ? 2 : 0;
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1e3a4a" }}>
        <span style={{ color: "#94a3b8", fontSize: "0.85rem", textAlign: "center" }}>{label}</span>
        <span style={{
          textAlign: "center", fontWeight: "600", fontSize: "0.95rem",
          color: better === 1 ? "#3b82f6" : "#e2e8f0",
          background: better === 1 ? "rgba(59,130,246,0.1)" : "transparent",
          borderRadius: "6px", padding: "4px 8px"
        }}>
          {typeof v1 === "number" ? v1.toFixed(2) : v1} {unit}
          {better === 1 && <span style={{ marginLeft: "4px", fontSize: "0.7rem" }}>✦</span>}
        </span>
        <span style={{
          textAlign: "center", fontWeight: "600", fontSize: "0.95rem",
          color: better === 2 ? "#f97316" : "#e2e8f0",
          background: better === 2 ? "rgba(249,115,22,0.1)" : "transparent",
          borderRadius: "6px", padding: "4px 8px"
        }}>
          {typeof v2 === "number" ? v2.toFixed(2) : v2} {unit}
          {better === 2 && <span style={{ marginLeft: "4px", fontSize: "0.7rem" }}>✦</span>}
        </span>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0b1d2a 0%, #0f2537 60%, #0b1d2a 100%)", padding: "40px 24px", color: "white", fontFamily: "sans-serif" }}>

      {/* Header */}
      <div style={{ maxWidth: "900px", margin: "0 auto 32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", margin: 0, letterSpacing: "-0.5px" }}>
          🚀 Motor Comparison
        </h1>
        <p style={{ color: "#64748b", marginTop: "6px", fontSize: "0.9rem" }}>
          Upload two motor CSV files to compare their thrust profiles and performance metrics.
        </p>
      </div>

      {/* Upload Card */}
      <div style={{ maxWidth: "900px", margin: "0 auto 32px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          {/* Motor 1 Upload */}
          <label style={{ display: "flex", flexDirection: "column", gap: "8px", cursor: "pointer" }}>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Motor 1</span>
            <div style={{
              border: `2px dashed ${file1 ? "#3b82f6" : "rgba(255,255,255,0.15)"}`,
              borderRadius: "10px", padding: "16px", textAlign: "center",
              background: file1 ? "rgba(59,130,246,0.07)" : "rgba(255,255,255,0.02)",
              transition: "all 0.2s"
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>📁</div>
              <div style={{ fontSize: "0.82rem", color: file1 ? "#3b82f6" : "#64748b" }}>
                {file1 ? file1.name : "Click to choose CSV"}
              </div>
              <input type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => setFile1(e.target.files[0])} />
            </div>
          </label>

          {/* Motor 2 Upload */}
          <label style={{ display: "flex", flexDirection: "column", gap: "8px", cursor: "pointer" }}>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Motor 2</span>
            <div style={{
              border: `2px dashed ${file2 ? "#f97316" : "rgba(255,255,255,0.15)"}`,
              borderRadius: "10px", padding: "16px", textAlign: "center",
              background: file2 ? "rgba(249,115,22,0.07)" : "rgba(255,255,255,0.02)",
              transition: "all 0.2s"
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>📁</div>
              <div style={{ fontSize: "0.82rem", color: file2 ? "#f97316" : "#64748b" }}>
                {file2 ? file2.name : "Click to choose CSV"}
              </div>
              <input type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => setFile2(e.target.files[0])} />
            </div>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!file1 || !file2 || loading}
          style={{
            width: "100%", padding: "14px", borderRadius: "10px", border: "none",
            background: (!file1 || !file2 || loading) ? "#1e3a4a" : "linear-gradient(90deg, #3b82f6, #6366f1)",
            color: (!file1 || !file2 || loading) ? "#475569" : "white",
            fontSize: "1rem", fontWeight: "700", cursor: (!file1 || !file2 || loading) ? "not-allowed" : "pointer",
            letterSpacing: "0.03em", transition: "all 0.2s"
          }}
        >
          {loading ? "⏳ Comparing..." : "⚡ Compare Motors"}
        </button>
      </div>

      {/* Chart */}
      {data && (
        <div style={{ maxWidth: "900px", margin: "0 auto 32px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: "1.1rem", fontWeight: "700", color: "#e2e8f0" }}>📈 Thrust vs Time</h2>
          <Plot
            data={[
              { x: data.motor1.time, y: data.motor1.thrust, type: "scatter", mode: "lines", name: file1?.name || "Motor 1", line: { color: "#3b82f6", width: 2.5 } },
              { x: data.motor2.time, y: data.motor2.thrust, type: "scatter", mode: "lines", name: file2?.name || "Motor 2", line: { color: "#f97316", width: 2.5 } },
            ]}
            layout={{
              xaxis: { title: "Time (s)", color: "#94a3b8", gridcolor: "#1e3a4a" },
              yaxis: { title: "Thrust (N)", color: "#94a3b8", gridcolor: "#1e3a4a" },
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent",
              font: { color: "#e2e8f0", family: "sans-serif" },
              legend: { bgcolor: "rgba(0,0,0,0.3)", bordercolor: "#1e3a4a", borderwidth: 1 },
              margin: { t: 10, r: 20, b: 50, l: 60 },
              autosize: true,
            }}
            style={{ width: "100%", height: "380px" }}
          />
        </div>
      )}

      {/* Metrics Comparison Table */}
      {data && (
        <div style={{ maxWidth: "900px", margin: "0 auto 32px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "1.1rem", fontWeight: "700", color: "#e2e8f0" }}>📊 Metrics Comparison</h2>

          {/* Column Headers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "4px" }}>
            <span style={{ color: "#475569", fontSize: "0.78rem", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>Metric</span>
            <div style={{ textAlign: "center" }}>
              <span style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6", borderRadius: "20px", padding: "4px 14px", fontSize: "0.82rem", fontWeight: "700" }}>
                Motor 1
              </span>
              <div style={{ color: "#475569", fontSize: "0.72rem", marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file1?.name}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", borderRadius: "20px", padding: "4px 14px", fontSize: "0.82rem", fontWeight: "700" }}>
                Motor 2
              </span>
              <div style={{ color: "#475569", fontSize: "0.72rem", marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file2?.name}</div>
            </div>
          </div>

          <MetricRow label="Max Thrust" v1={data.motor1.metrics.max_thrust} v2={data.motor2.metrics.max_thrust} unit="N" />
          <MetricRow label="Total Impulse" v1={data.motor1.metrics.total_impulse} v2={data.motor2.metrics.total_impulse} unit="Ns" />
          <MetricRow label="Burn Time" v1={data.motor1.metrics.burn_time} v2={data.motor2.metrics.burn_time} unit="s" />
        </div>
      )}

      {/* Winner Banner */}
      {data && best && (
        <div style={{ maxWidth: "900px", margin: "0 auto", borderRadius: "16px", padding: "24px 32px", textAlign: "center",
          background: best.winner === "Tie"
            ? "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))"
            : best.winner === "Motor 1"
            ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))"
            : "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.05))",
          border: `1px solid ${best.color}40`
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>
            {best.winner === "Tie" ? "🤝" : "🏆"}
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: "800", color: best.color, marginBottom: "6px" }}>
            {best.winner === "Tie" ? "It's a Tie!" : `${best.winner} Wins!`}
          </div>
          <div style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
            {best.winner === "Tie"
              ? "Both motors perform equally across all metrics."
              : `${best.file || best.winner} outperforms across more metrics — higher thrust, impulse, or burn time.`}
          </div>
        </div>
      )}

    </div>
  );
}
