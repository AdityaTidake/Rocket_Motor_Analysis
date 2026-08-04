import { useState, useRef } from "react";
import axios from "axios";
import ThrustChart from "../components/ThrustChart";
import ErrorBoundary from "../components/ErrorBoundary";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [minTime, setMinTime] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const form = new FormData();
      form.append("file", file);

      let url = "/api/upload/";
      const params = [];
      if (minTime !== "") params.push(`min_time=${minTime}`);
      if (maxTime !== "") params.push(`max_time=${maxTime}`);
      if (params.length) url += "?" + params.join("&");

      const res = await axios.post(url, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status === "error") {
        setError(res.data.message);
      } else {
        setResult(res.data);
      }
    } catch (e) {
      setError(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <h2>Understand Your Motor Data</h2>
        <p className="page-intro">
          Before uploading your CSV file, here’s a quick overview of what this
          analysis does and the key concepts involved:
        </p>

        <div className="page-points">🔹 Thrust-Time Data</div>
        <p>
          Rocket motor performance is defined by its thrust curve — how thrust
          varies with time. Your CSV should contain:
          <br />
          Time (s) → Duration of burn <br />
          Thrust (N) → Force produced by the motor
        </p>

        <div className="page-points">🔹 Total Impulse (Motor Power)</div>
        <p>
          Represents total energy delivered by the motor (area under thrust-time
          curve).
          <br />
          <BlockMath math="I = \int F(t)\,dt" />
          Measured in Newton-seconds (Ns) <br />
          Determines motor class and overall performance
        </p>

        <div className="page-points">🔹 Average Thrust</div>
        <p>
          Average force during burn. Helps estimate sustained lifting
          capability.
          <BlockMath math="F_{avg} = \frac{I}{t_{burn}}" />
        </p>

        <div className="page-points">🔹 Peak Thrust</div>
        <p>
          Maximum thrust achieved. Important for liftoff and initial
          acceleration.
        </p>

        <div className="page-points">🔹 Burn Time</div>
        <p>Total duration of thrust. Affects flight time and trajectory.</p>

        <div className="page-points">🔹 Curve Fitting & Analysis</div>
        <p>
          Generates a best-fit curve to smooth data, improve simulation
          accuracy, and predict performance trends.
        </p>
      </div>

      {/* Upload Card */}
      <div className="card">
        <h2>Upload Thrust CSV</h2>
        <div className="upload-area" onClick={() => inputRef.current.click()}>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <span style={{ fontSize: "2rem" }}>📂</span>
          <p>Click to select a CSV file (columns: time, thrust)</p>
          {file && <div className="file-name">Selected: {file.name}</div>}
        </div>

        <div className="filter-row">
          <label>
            Min Time (s)
            <input
              type="number"
              placeholder="e.g. 0"
              value={minTime}
              onChange={(e) => setMinTime(e.target.value)}
            />
          </label>
          <label>
            Max Time (s)
            <input
              type="number"
              placeholder="e.g. 5"
              value={maxTime}
              onChange={(e) => setMaxTime(e.target.value)}
            />
          </label>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!file || loading}
            style={{ marginTop: "18px" }}
          >
            {loading ? "Processing..." : "Analyze"}
          </button>
        </div>

        {loading && (
          <div className="status-msg loading">Processing your file...</div>
        )}
        {error && <div className="status-msg error">{error}</div>}
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Metrics */}
          <div className="card">
            <h2>Motor Metrics</h2>
            <div className="metrics-grid">
              <div className="metric-box">
                <div className="value">{result.metrics.burn_time}s</div>
                <div className="label">Burn Time</div>
              </div>
              <div className="metric-box">
                <div className="value">{result.metrics.total_impulse} Ns</div>
                <div className="label">Total Impulse</div>
              </div>
              <div className="metric-box">
                <div className="value">{result.metrics.avg_thrust} N</div>
                <div className="label">Avg Thrust</div>
              </div>
              <div className="metric-box">
                <div className="value">{result.metrics.peak_thrust} N</div>
                <div className="label">Peak Thrust</div>
              </div>
            </div>
            <div style={{ marginTop: "12px" }}>
              <span style={{ fontSize: "0.82rem", color: "#777" }}>
                Best fit model:{" "}
              </span>
              <strong>{result.best_fit_model}</strong>
              <div className="equation-badge">{result.equation}</div>
            </div>
          </div>

          {/* Chart */}
          <div className="card">
            <h2>Thrust Curve</h2>
            <ErrorBoundary>
              <ThrustChart
                time={result.time}
                thrust={result.thrust}
                idealCurve={result.ideal_curve}
              />
            </ErrorBoundary>
          </div>

          {/* Download */}
          <div className="card">
            <h2>Download RSE File</h2>
            <div className="download-section">
              <span style={{ fontSize: "0.88rem", color: "#555" }}>
                RSE file ready: <strong>{result.rse_file}</strong>
              </span>
              <a
                href={result.download_url}
                download={result.rse_file}
                className="btn btn-secondary"
              >
                ⬇ Download .rse
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
