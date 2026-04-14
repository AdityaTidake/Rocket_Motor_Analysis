import { useRef, useState } from "react";
import axios from "axios";
import Plot from "../components/PlotlyChart";
import ErrorBoundary from "../components/ErrorBoundary";
import "./MotorComparisonPage.css";

function MetricRow({ label, v1, v2, unit }) {
  const better = v1 > v2 ? 1 : v2 > v1 ? 2 : 0;

  return (
    <div className="comparison-metric-row">
      <span className="comparison-metric-label">{label}</span>
      <span
        className={`comparison-metric-value ${better === 1 ? "is-better is-motor-1" : ""}`}
      >
        {typeof v1 === "number" ? v1.toFixed(2) : v1} {unit}
        {better === 1 && <span className="comparison-metric-badge">Best</span>}
      </span>
      <span
        className={`comparison-metric-value ${better === 2 ? "is-better is-motor-2" : ""}`}
      >
        {typeof v2 === "number" ? v2.toFixed(2) : v2} {unit}
        {better === 2 && <span className="comparison-metric-badge">Best</span>}
      </span>
    </div>
  );
}

export default function MotorComparisonPage() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);

  const handleSubmit = async () => {
    if (!file1 || !file2) {
      setError("Please upload both motor CSV files.");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    const formData = new FormData();
    formData.append("motor1", file1);
    formData.append("motor2", file2);

    try {
      const res = await axios.post("/api/compare-motors/", formData);

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setData(res.data);
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          requestError.message ||
          "Error comparing motors",
      );
    } finally {
      setLoading(false);
    }
  };

  const getBestMotor = () => {
    if (!data) return null;

    const m1 = data.motor1.metrics;
    const m2 = data.motor2.metrics;
    let score1 = 0;
    let score2 = 0;

    if (m1.max_thrust > m2.max_thrust) score1 += 1;
    else if (m2.max_thrust > m1.max_thrust) score2 += 1;

    if (m1.total_impulse > m2.total_impulse) score1 += 1;
    else if (m2.total_impulse > m1.total_impulse) score2 += 1;

    if (m1.burn_time > m2.burn_time) score1 += 1;
    else if (m2.burn_time > m1.burn_time) score2 += 1;

    if (score1 > score2) {
      return {
        winner: "Motor 1",
        file: file1?.name,
        className: "winner-motor-1",
      };
    }

    if (score2 > score1) {
      return {
        winner: "Motor 2",
        file: file2?.name,
        className: "winner-motor-2",
      };
    }

    return { winner: "Tie", file: null, className: "winner-tie" };
  };

  const best = getBestMotor();

  return (
    <div className="page">
      <div className="page-content">
        <h2>Compare Two Motor Profiles</h2>
        <p className="page-intro">
          Upload two thrust CSV files to compare thrust curves and the core
          performance metrics side by side using the same workflow as the motor
          analysis page.
        </p>

        <div className="page-points">Motor Inputs</div>
        <p>
          Each file should include <strong>time</strong> and{" "}
          <strong>thrust</strong> columns so both motors can be evaluated on the
          same basis.
        </p>

        <div className="page-points">Metric Comparison</div>
        <p>
          The comparison highlights max thrust, total impulse, and burn time so
          you can quickly identify which motor performs better in each category.
        </p>

        <div className="page-points">Thrust Curve Overlay</div>
        <p>
          Both thrust profiles are plotted on the same chart to make burn
          behavior, peak regions, and curve shape differences immediately
          visible.
        </p>
      </div>

      <div className="card">
        <h2>Upload Motor CSVs</h2>
        <div className="comparison-upload-grid">
          <div>
            <div className="comparison-upload-label">Motor 1</div>
            <div
              className={`upload-area comparison-upload-area ${file1 ? "has-file motor-1" : ""}`}
              onClick={() => inputRef1.current.click()}
            >
              <input
                ref={inputRef1}
                type="file"
                accept=".csv"
                onChange={(e) => setFile1(e.target.files[0])}
              />
              <span>📂</span>
              <p>Click to select the first motor file</p>
              {file1 && <div className="file-name">Selected: {file1.name}</div>}
            </div>
          </div>

          <div>
            <div className="comparison-upload-label">Motor 2</div>
            <div
              className={`upload-area comparison-upload-area ${file2 ? "has-file motor-2" : ""}`}
              onClick={() => inputRef2.current.click()}
            >
              <input
                ref={inputRef2}
                type="file"
                accept=".csv"
                onChange={(e) => setFile2(e.target.files[0])}
              />
              <span>📂</span>
              <p>Click to select the second motor file</p>
              {file2 && <div className="file-name">Selected: {file2.name}</div>}
            </div>
          </div>
        </div>

        <div className="comparison-action-row">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!file1 || !file2 || loading}
          >
            {loading ? "Comparing..." : "Compare Motors"}
          </button>
        </div>

        {loading && (
          <div className="status-msg loading">Comparing both motor files...</div>
        )}
        {error && <div className="status-msg error">{error}</div>}
      </div>

      {data && (
        <div className="card">
          <h2>Thrust Curve Comparison</h2>
          <ErrorBoundary>
            <Plot
              data={[
                {
                  x: data.motor1.time,
                  y: data.motor1.thrust,
                  type: "scatter",
                  mode: "lines",
                  name: file1?.name || "Motor 1",
                  line: { color: "#f87171", width: 2.5 },
                },
                {
                  x: data.motor2.time,
                  y: data.motor2.thrust,
                  type: "scatter",
                  mode: "lines",
                  name: file2?.name || "Motor 2",
                  line: { color: "#c084fc", width: 2.5 },
                },
              ]}
              layout={{
                autosize: true,
                margin: { t: 10, r: 20, b: 50, l: 60 },
                xaxis: {
                  title: "Time (s)",
                  color: "#a3b8cc",
                  gridcolor: "rgba(255,255,255,0.1)",
                },
                yaxis: {
                  title: "Thrust (N)",
                  color: "#a3b8cc",
                  gridcolor: "rgba(255,255,255,0.1)",
                },
                paper_bgcolor: "transparent",
                plot_bgcolor: "transparent",
                font: { color: "#a3b8cc" },
                legend: {
                  bgcolor: "rgba(10, 15, 30, 0.6)",
                  bordercolor: "rgba(255,255,255,0.1)",
                  borderwidth: 1,
                  font: { color: "#e6edf3" }
                },
              }}
              style={{ width: "100%", height: "380px" }}
            />
          </ErrorBoundary>
        </div>
      )}

      {data && (
        <div className="card">
          <h2>Metrics Comparison</h2>
          <div className="comparison-metric-header">
            <span className="comparison-metric-title">Metric</span>
            <div className="comparison-header-block">
              <span className="comparison-pill motor-1">Motor 1</span>
              <div className="comparison-header-file">{file1?.name}</div>
            </div>
            <div className="comparison-header-block">
              <span className="comparison-pill motor-2">Motor 2</span>
              <div className="comparison-header-file">{file2?.name}</div>
            </div>
          </div>

          <MetricRow
            label="Max Thrust"
            v1={data.motor1.metrics.max_thrust}
            v2={data.motor2.metrics.max_thrust}
            unit="N"
          />
          <MetricRow
            label="Total Impulse"
            v1={data.motor1.metrics.total_impulse}
            v2={data.motor2.metrics.total_impulse}
            unit="Ns"
          />
          <MetricRow
            label="Burn Time"
            v1={data.motor1.metrics.burn_time}
            v2={data.motor2.metrics.burn_time}
            unit="s"
          />
        </div>
      )}

      {data && best && (
        <div className={`card comparison-winner-card ${best.className}`}>
          <h2>Comparison Result</h2>
          <div className="comparison-winner-title">
            {best.winner === "Tie" ? "Tie" : `${best.winner} Wins`}
          </div>
          <p className="comparison-winner-text">
            {best.winner === "Tie"
              ? "Both motors perform equally across the compared metrics."
              : `${best.file || best.winner} performs better across more of the selected metrics.`}
          </p>
        </div>
      )}
    </div>
  );
}
