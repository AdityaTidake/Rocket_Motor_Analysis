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
            title="Thrust Analysis & .RSE Generation"
            desc="Upload CSV and analyze the thrust curve & download .RSE files"
            onClick={() => navigate("/analyze")}
          />
          <ActionCard
            title="Simulate Motor"
            desc="Run performance calculations for the motor setup."
            onClick={() => navigate("/simulate")}
          />
          <ActionCard
            title="Comparison of Motors"
            desc="Compare the performance of different motor configurations."
            onClick={() => navigate("/compare")}
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
