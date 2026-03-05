import { Link } from "react-router-dom";
import SpecialCard from "../../components/SpecialCard/SpecialCard";
import "./HomePage.css";

/**
 * Weekly specials data.
 * Images reference files in the public/ folder via process.env.PUBLIC_URL.
 * Swap in real dish photos by updating the `image` paths.
 */
const SPECIALS = [
  {
    id: 1,
    name: "Greek Salad",
    price: "$12.99",
    description:
      "The famous greek salad of crispy lettuce, peppers, olives and our Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons.",
    image: process.env.PUBLIC_URL + "/greek-salad.jpg",
    imageAlt: "Fresh Greek salad with crispy lettuce, tomatoes, olives, and feta cheese",
  },
  {
    id: 2,
    name: "Bruchetta",
    price: "$5.99",
    description:
      "Our Bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil.",
    image: process.env.PUBLIC_URL + "/bruschetta.jpg",
    imageAlt: "Bruschetta on grilled bread topped with tomatoes and herbs",
  },
  {
    id: 3,
    name: "Lemon Dessert",
    price: "$5.00",
    description:
      "This comes straight from grandma's recipe book, every last ingredient has been sourced and is as authentic as can be imagined.",
    image: process.env.PUBLIC_URL + "/lemon-dessert.jpg",
    imageAlt: "Slice of homemade lemon layer cake dusted with icing sugar",
  },
];

/**
 * Home page — hero section + This week's specials.
 */
function HomePage() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section className="hero" aria-label="Little Lemon hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <h1 className="hero__title">Little Lemon</h1>
            <h2 className="hero__subtitle">Chicago</h2>
            <p className="hero__description">
              We are a family owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </p>
            <Link
              to="/reservations"
              className="hero__cta"
              aria-label="Reserve a table at Little Lemon"
            >
              Reserve a Table
            </Link>
          </div>
          <div className="hero__image-wrapper">
            <img
              src={process.env.PUBLIC_URL + "/bruschetta.jpg"}
              alt="Bruschetta dish served at Little Lemon restaurant"
              className="hero__image"
            />
          </div>
        </div>
      </section>

      {/* ---- This week's specials ---- */}
      <section
        className="specials"
        aria-labelledby="specials-heading"
      >
        <div className="container">
          <div className="specials__header">
            <h2 id="specials-heading" className="specials__title">
              This week's specials!
            </h2>
            <a
              href="#menu"
              className="specials__menu-btn"
              aria-label="View the full online menu"
            >
              Online Menu
            </a>
          </div>

          <ul className="specials__grid" role="list">
            {SPECIALS.map((item) => (
              <li key={item.id}>
                <SpecialCard {...item} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default HomePage;
