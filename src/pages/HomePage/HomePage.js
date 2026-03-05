import { Link } from "react-router-dom";
import "./HomePage.css";

/**
 * Home page — placeholder hero section.
 * Additional sections (Specials, Testimonials, About) will be added later.
 */
function HomePage() {
  return (
    <>
      {/* Hero section */}
      <section className="hero" aria-label="Little Lemon hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <h1 className="hero__title">Little Lemon</h1>
            <h2 className="hero__subtitle">Chicago</h2>
            <p className="hero__description">
              We are a family-owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </p>
            <Link
              to="/reservations"
              className="hero__cta"
              aria-label="Reserve a table at Little Lemon"
            >
              Reserve a table
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
