import { NavLink } from "react-router-dom";
import "./Nav.css";

/**
 * Primary navigation links.
 * Uses React Router's NavLink so the active route gets an
 * "active" class automatically for visual highlighting.
 */
function Nav() {
  return (
    <nav aria-label="Main navigation">
      <ul className="nav__list" role="list">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav__link nav__link--active" : "nav__link"}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/reservations" className={({ isActive }) => isActive ? "nav__link nav__link--active" : "nav__link"}>
            Reservations
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
