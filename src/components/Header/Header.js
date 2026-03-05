import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import "./Header.css";

/**
 * Site-wide header with the Little Lemon SVG logo and primary navigation.
 * The logo links back to the home page.
 */
function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        {/* SVG logo from public/Logo.svg — links to home */}
        <Link to="/" aria-label="Little Lemon — go to home page">
          <img
            src={process.env.PUBLIC_URL + "/Logo.svg"}
            alt="Little Lemon"
            className="header__logo"
            width="148"
            height="40"
          />
        </Link>

        <Nav />
      </div>
    </header>
  );
}

export default Header;
