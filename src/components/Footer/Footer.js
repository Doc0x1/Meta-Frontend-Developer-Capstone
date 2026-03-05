import { Link } from "react-router-dom";
import "./Footer.css";

/**
 * Site-wide footer with logo, nav links, contact info, and social links.
 * Mirrors the nav structure from the header for consistency.
 */
function Footer() {
  return (
    <footer className="footer" aria-label="Site footer">
      <div className="container footer__inner">

        {/* Logo */}
        <div className="footer__brand">
          <Link to="/" aria-label="Little Lemon — go to home page">
            <img
              src={process.env.PUBLIC_URL + "/Logo.svg"}
              alt="Little Lemon"
              className="footer__logo"
              width="148"
              height="40"
            />
          </Link>
        </div>

        {/* Nav links */}
        <nav className="footer__nav" aria-label="Footer navigation">
          <h2 className="footer__heading">Doormat Navigation</h2>
          <ul className="footer__list" role="list">
            <li><Link to="/" className="footer__link">Home</Link></li>
            <li><a href="#about" className="footer__link">About</a></li>
            <li><a href="#menu" className="footer__link">Menu</a></li>
            <li><Link to="/reservations" className="footer__link">Reservations</Link></li>
            <li><a href="#order" className="footer__link">Order Online</a></li>
            <li><a href="#login" className="footer__link">Login</a></li>
          </ul>
        </nav>

        {/* Contact info */}
        <address className="footer__contact">
          <h2 className="footer__heading">Contact</h2>
          <ul className="footer__list" role="list">
            <li>123 W Madison St</li>
            <li>Chicago, IL 60602</li>
            <li>
              <a href="tel:+13125550142" className="footer__link">
                (312) 555-0142
              </a>
            </li>
            <li>
              <a href="mailto:hello@littlelemon.com" className="footer__link">
                hello@littlelemon.com
              </a>
            </li>
          </ul>
        </address>

        {/* Social links */}
        <div className="footer__social">
          <h2 className="footer__heading">Social Media Links</h2>
          <ul className="footer__list" role="list">
            <li>
              <a
                href="https://facebook.com"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Little Lemon on Facebook"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Little Lemon on Instagram"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Little Lemon on Twitter"
              >
                Twitter
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer__bottom">
        <p className="footer__copy">
          © {new Date().getFullYear()} Little Lemon. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
