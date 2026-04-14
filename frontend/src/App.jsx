import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import UploadPage from "./pages/UploadPage";
import SimulatePage from "./pages/SimulatePage";
import MotorComparisonPage from "./pages/MotorComparisonPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyze" element={<UploadPage />} />
        <Route path="/simulate" element={<SimulatePage />} />
        <Route path="/compare" element={<MotorComparisonPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
