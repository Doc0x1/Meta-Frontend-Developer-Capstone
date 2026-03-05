import "./SpecialCard.css";

/**
 * A single "This week's specials" card.
 *
 * Props:
 *  - name        {string}  — dish name
 *  - price       {string}  — formatted price e.g. "$12.99"
 *  - description {string}  — short description
 *  - image       {string}  — image src path
 *  - imageAlt    {string}  — descriptive alt text for the image
 */
function SpecialCard({ name, price, description, image, imageAlt }) {
  return (
    <article className="special-card">
      <img
        src={image}
        alt={imageAlt}
        className="special-card__image"
        loading="lazy"
      />
      <div className="special-card__body">
        <div className="special-card__header">
          <h3 className="special-card__name">{name}</h3>
          <span className="special-card__price" aria-label={`Price: ${price}`}>
            {price}
          </span>
        </div>
        <p className="special-card__description">{description}</p>
        <a
          href="#order"
          className="special-card__order"
          aria-label={`Order ${name} for delivery`}
        >
          Order a delivery{" "}
          <span aria-hidden="true" role="img">
            🛵
          </span>
        </a>
      </div>
    </article>
  );
}

export default SpecialCard;
