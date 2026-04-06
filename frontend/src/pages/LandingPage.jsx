import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import ActionCard from "../components/ActionCard";
import FeatureCard from "../components/FeatureCard";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-left">
          <span className="hero-eyebrow">Rocket test data to motor output</span>
          <h1>Rocket Motor Analysis</h1>
          <p>
            Analyze thrust curves, simulate performance, and generate
            OpenRocket-compatible motor files.
          </p>
          <button onClick={() => navigate("/analyze")}>Get Started</button>
        </div>

        <div className="hero-right">
          <ActionCard
            title="Thrust Analysis"
            desc="Upload CSV and analyze the thrust curve."
            onClick={() => navigate("/analyze")}
          />
          <ActionCard
            title="Generate .RSE"
            desc="Create OpenRocket-compatible motor files."
            onClick={() => navigate("/analyze")}
          />
          <ActionCard
            title="Simulate Motor"
            desc="Run performance calculations for the motor setup."
            onClick={() => navigate("/simulate")}
          />
        </div>
      </section>

      <section className="features">
        <FeatureCard title="Fast Processing" />
        <FeatureCard title="Accurate Simulation" />
        <FeatureCard title="OpenRocket Ready" />
      </section>

      <footer>
        <p>&copy; 2026 Rocket Motor Analysis</p>
      </footer>
    </div>
  );
}

export default LandingPage;
