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

      <section className="about">
        <div className="about-content">
          <h2>About Rocket Motor Analysis</h2>
          <p>
            Welcome to your all-in-one Rocket Motor Analysis and Flight
            Simulation platform. This tool helps you explore, compare, and
            understand rocket performance in a simple and interactive way.{" "}
            <br></br>
            <div class="about-points">🔧 Simulate Rocket Flight:</div>
            Upload or use generated motor data to simulate vertical rocket
            flight and instantly view key parameters like altitude, velocity,
            and acceleration over time. <br></br>
            <div class="about-points">📊 Visualize Performance: </div>
            Get clear, interactive graphs such as altitude vs time and velocity
            vs time to easily analyze how your rocket behaves during flight.{" "}
            <br></br>
            <div class="about-points">⚖️ Compare Motors: </div> Select and
            compare two different rocket motors under identical conditions to
            see how thrust variations impact performance.<br></br>
            <div class="about-points">📁 Easy Data Handling: </div>
            Quickly upload CSV files or use built-in data formats—no complex
            setup required. <br></br>
            <div class="about-points">💡 Make Better Decisions:</div>
            Use insights from simulations and comparisons to choose the most
            suitable motor for your rocket design. Start exploring and take your
            rocket analysis to the next level! 🚀
          </p>
        </div>
      </section>

      <footer>
        <p>&copy; 2026 Rocket Motor Analysis</p>
      </footer>
    </div>
  );
}

export default LandingPage;
