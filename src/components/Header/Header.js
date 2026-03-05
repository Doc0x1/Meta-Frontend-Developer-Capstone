import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import "./Header.css";

/**
 * Site-wide header containing the Little Lemon logo and primary navigation.
 * The logo links back to the home page.
 */
function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        {/* Logo — wrapped in a link so clicking it returns the user home */}
        <Link to="/" className="header__logo" aria-label="Little Lemon — go to home page">
          <span className="header__logo-name">Little Lemon</span>
          <span className="header__logo-tagline">Chicago</span>
        </Link>

        <Nav />
      </div>
    </header>
  );
}

export default Header;
