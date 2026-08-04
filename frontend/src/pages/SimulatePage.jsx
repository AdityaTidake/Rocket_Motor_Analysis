import { useState, useRef } from "react";
import axios from "axios";
import SimChart from "../components/SimChart";
import ErrorBoundary from "../components/ErrorBoundary";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export default function SimulatePage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [params, setParams] = useState({
    mass: "",
    Cd: "",
    area: "",
    rho: "",
  });
  const inputRef = useRef();

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setParams((current) => ({
      ...current,
      [name]: value,
    }));
  };

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

      if (Object.values(params).some((value) => value.trim() === "")) {
        setError("Enter mass, Cd, area, and rho before running the simulation");
        setLoading(false);
        return;
      }

      const mass = parseFloat(params.mass);
      const Cd = parseFloat(params.Cd);
      const area = parseFloat(params.area);
      const rho = parseFloat(params.rho);

      if ([mass, Cd, area, rho].some((value) => Number.isNaN(value))) {
        setError("Mass, Cd, area, and rho must all be valid numbers");
        setLoading(false);
        return;
      }

      const res = await axios.post("/api/simulate", {
        thrust_curve,
        mass,
        Cd,
        area,
        rho,
      });

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

        <div className="page-points">🔹 Drag Force</div>
        <p>Drag is computed using the parameters you provide on the simulator:</p>
        <BlockMath math="D = \frac{1}{2}\rho C_d A v^2" />
        <p>
          Where: <br />
          &rho; → Air density <br />
          C<sub>d</sub> → Drag coefficient <br />
          A → Reference area <br />
          v → Velocity
        </p>

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
        <div className="sim-params-grid">
          <label>
            Mass (kg)
            <input
              type="number"
              name="mass"
              value={params.mass}
              onChange={handleParamChange}
              required
              min="0"
              step="any"
              placeholder="e.g. 1.5"
            />
          </label>
          <label>
            Cd
            <input
              type="number"
              name="Cd"
              value={params.Cd}
              onChange={handleParamChange}
              required
              min="0"
              step="any"
              placeholder="e.g. 0.75"
            />
          </label>
          <label>
            Area (m²)
            <input
              type="number"
              name="area"
              value={params.area}
              onChange={handleParamChange}
              required
              min="0"
              step="any"
              placeholder="e.g. 0.01"
            />
          </label>
          <label>
            Rho (kg/m³)
            <input
              type="number"
              name="rho"
              value={params.rho}
              onChange={handleParamChange}
              required
              min="0"
              step="any"
              placeholder="e.g. 1.225"
            />
          </label>
        </div>
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
