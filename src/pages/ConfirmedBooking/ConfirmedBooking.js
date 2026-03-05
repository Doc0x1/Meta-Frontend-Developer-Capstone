import { Link, useLocation } from "react-router-dom";
import "./ConfirmedBooking.css";

/**
 * Confirmation page displayed after a successful reservation.
 * Reads the booking details from React Router location state
 * (passed by BookingPage via navigate("/confirmed", { state })).
 * Displays a summary so the user can verify their booking at a glance.
 */
function ConfirmedBooking() {
  const location = useLocation();
  const booking = location.state?.booking;

  return (
    <section className="confirmed" aria-labelledby="confirmed-heading">
      <div className="container confirmed__inner">
        {/* Success icon (CSS-drawn checkmark — no external assets required) */}
        <div className="confirmed__icon" aria-hidden="true">✓</div>

        <h1 id="confirmed-heading" className="confirmed__title">
          Your reservation is confirmed!
        </h1>
        <p className="confirmed__message">
          Thank you{booking ? `, ${booking.firstName}` : ""}. We can't wait to
          see you at Little Lemon.
        </p>

        {/* Booking summary table — only shown when state is available */}
        {booking && (
          <dl className="confirmed__summary" aria-label="Booking summary">
            <div className="confirmed__summary-row">
              <dt>Name</dt>
              <dd>{booking.firstName} {booking.lastName}</dd>
            </div>
            <div className="confirmed__summary-row">
              <dt>Email</dt>
              <dd>{booking.email}</dd>
            </div>
            <div className="confirmed__summary-row">
              <dt>Date</dt>
              <dd>{booking.date}</dd>
            </div>
            <div className="confirmed__summary-row">
              <dt>Time</dt>
              <dd>{booking.time}</dd>
            </div>
            <div className="confirmed__summary-row">
              <dt>Guests</dt>
              <dd>{booking.guests}</dd>
            </div>
            {booking.occasion && (
              <div className="confirmed__summary-row">
                <dt>Occasion</dt>
                <dd>{booking.occasion}</dd>
              </div>
            )}
          </dl>
        )}

        <p className="confirmed__note">
          A confirmation has been noted. If you need to change or cancel your
          booking, please call us directly.
        </p>

        <Link
          to="/"
          className="confirmed__home-link"
          aria-label="Back to Little Lemon home page"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}

export default ConfirmedBooking;
