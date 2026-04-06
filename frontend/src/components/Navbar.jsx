import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink className="logo" to="/">
        Rocket Motor Analysis
      </NavLink>

      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/analyze"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Analyze
        </NavLink>
        <NavLink
          to="/simulate"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Simulation
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
