import { NavLink } from "react-router-dom";
import "./Nav.css";

/**
 * Primary navigation links matching the Little Lemon design.
 * Routes with pages use NavLink for active-state highlighting.
 * Placeholder links (About, Menu, Order Online, Login) are plain anchors
 * until those pages are implemented.
 */
function Nav() {
  const activeClass = ({ isActive }) =>
    isActive ? "nav__link nav__link--active" : "nav__link";

  return (
    <nav aria-label="Main navigation">
      <ul className="nav__list" role="list">
        <li>
          <NavLink to="/" end className={activeClass}>
            Home
          </NavLink>
        </li>
        <li>
          {/* Placeholder — About page not yet implemented */}
          <a href="#about" className="nav__link">
            About
          </a>
        </li>
        <li>
          {/* Placeholder — Menu page not yet implemented */}
          <a href="#menu" className="nav__link">
            Menu
          </a>
        </li>
        <li>
          <NavLink to="/reservations" className={activeClass}>
            Reservations
          </NavLink>
        </li>
        <li>
          {/* Placeholder — Order Online page not yet implemented */}
          <a href="#order" className="nav__link">
            Order Online
          </a>
        </li>
        <li>
          {/* Placeholder — Login page not yet implemented */}
          <a href="#login" className="nav__link">
            Login
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
