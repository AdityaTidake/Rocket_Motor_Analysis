import { useState, useRef } from "react";
import axios from "axios";
import SimChart from "../components/SimChart";
import ErrorBoundary from "../components/ErrorBoundary";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

export default function SimulatePage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleSimulate = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const text = await file.text();
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const timeIdx = headers.indexOf("time");
      const thrustIdx = headers.indexOf("thrust");

      if (timeIdx === -1 || thrustIdx === -1) {
        setError('CSV must have "time" and "thrust" columns');
        setLoading(false);
        return;
      }

      const thrust_curve = lines
        .slice(1)
        .map((line) => {
          const cols = line.split(",");
          return {
            time: parseFloat(cols[timeIdx]),
            thrust: parseFloat(cols[thrustIdx]),
          };
        })
        .filter((r) => !isNaN(r.time) && !isNaN(r.thrust));

      const res = await axios.post("/api/simulate", { thrust_curve });

      if (res.data.status === "error") {
        setError(res.data.message);
      } else {
        setResult(res.data.simulation);
      }
    } catch (e) {
      setError(e.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <h2>Rocket Flight Simulation </h2>

        <p className="page-intro">
          Before running the simulation, here’s a quick guide to how the
          rocket’s motion is modeled and what the results represent:
        </p>

        {/* Equation of Motion */}
        <div className="page-points">🔹 Equation of Motion</div>
        <p>The rocket’s vertical motion is governed by Newton’s Second Law:</p>
        <BlockMath math="F_{net} = ma = T - mg - D" />
        <p>
          Where: <br />
          T → Thrust force <br />
          mg → Weight (gravity) <br />D → Aerodynamic drag
        </p>

        {/* Acceleration */}
        <div className="page-points">🔹 Acceleration</div>
        <p>Acceleration varies based on net force:</p>
        <BlockMath math="a(t) = \frac{T(t) - mg - D}{m}" />
        <p>Determines how quickly the rocket speeds up or slows down.</p>

        {/* Velocity */}
        <div className="page-points">🔹 Velocity</div>
        <p>Velocity is obtained by integrating acceleration:</p>
        <BlockMath math="v(t) = \int a(t)\,dt" />
        <p>Shows how fast the rocket is moving at any instant.</p>

        {/* Altitude */}
        <div className="page-points">🔹 Altitude</div>
        <p>Altitude is calculated from velocity:</p>
        <BlockMath math="h(t) = \int v(t)\,dt" />
        <p>Represents the height reached during flight.</p>

        {/* Flight Phases */}
        <div className="page-points">🔹 Flight Phases</div>
        <p>
          Powered Ascent → Thrust is active <br />
          Coasting Phase → Rocket slows under gravity <br />
          Peak Altitude → Maximum height where velocity becomes zero
        </p>

        {/* Output */}
        <div className="page-points">🔹 Simulation Output</div>
        <p>
          Altitude vs Time → Flight trajectory <br />
          Velocity vs Time → Speed profile <br />
          Acceleration vs Time → Force behavior
        </p>

        <div className="page-points">🚀 Run Your Simulation</div>
        <p>
          Upload your thrust CSV and run the simulation to visualize real flight
          performance.
        </p>
      </div>

      <div className="card">
        <h2>Flight Simulation</h2>
        <p style={{ fontSize: "0.85rem", color: "#777", marginBottom: "16px" }}>
          Upload a thrust CSV to simulate altitude, velocity, and acceleration
          over time.
        </p>
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

        <div style={{ marginTop: "16px" }}>
          <button
            className="btn btn-primary"
            onClick={handleSimulate}
            disabled={!file || loading}
          >
            {loading ? "Simulating..." : "Run Simulation"}
          </button>
        </div>

        {loading && (
          <div className="status-msg loading">Running simulation...</div>
        )}
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
  );
}
