import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import BookingForm from "../../components/BookingForm/BookingForm";
import { fetchAPI, submitAPI } from "../../api";
import "./BookingPage.css";

/* ============================================================
   Times reducer — manages available time slots.
   Follows the useReducer pattern taught in the Meta course.
   ============================================================ */

/**
 * Returns an initial list of available times using today's date.
 * Called once when the component first mounts.
 */
export function initializeTimes() {
  return fetchAPI(new Date());
}

/**
 * Reducer for the available times state.
 * On UPDATE_TIMES, calls fetchAPI with the provided date and
 * returns the fresh list of time slots.
 */
export function timesReducer(state, action) {
  switch (action.type) {
    case "UPDATE_TIMES":
      // action.date is a YYYY-MM-DD string from the date input;
      // fetchAPI expects a Date object (calls .getDate() internally).
      return fetchAPI(new Date(action.date));
    default:
      return state;
  }
}

/* ============================================================
   BookingPage component
   ============================================================ */

/**
 * Page that hosts the BookingForm.
 * Manages available times via useReducer and handles form submission.
 */
function BookingPage() {
  const [availableTimes, dispatch] = useReducer(timesReducer, null, initializeTimes);
  const navigate = useNavigate();

  /** Called by BookingForm when the date field changes. */
  function handleDateChange(date) {
    dispatch({ type: "UPDATE_TIMES", date });
  }

  /**
   * Called by BookingForm with validated data.
   * Sends to submitAPI; on success navigates to the confirmation page,
   * passing the booking details via router state for display.
   */
  function handleSubmit(formData) {
    const success = submitAPI(formData);
    if (success) {
      navigate("/confirmed", { state: { booking: formData } });
    } else {
      // submitAPI always returns true in the mock, but we handle the
      // false case for robustness / future real API integration.
      alert("There was a problem submitting your reservation. Please try again.");
    }
  }

  return (
    <section className="booking-page" aria-labelledby="booking-page-heading">
      <div className="container">
        <header className="booking-page__header">
          <h1 id="booking-page-heading" className="booking-page__title">
            Reserve a table
          </h1>
          <p className="booking-page__subtitle">
            Book your table at Little Lemon — we look forward to welcoming you.
          </p>
        </header>

        <BookingForm
          availableTimes={availableTimes}
          onDateChange={handleDateChange}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}

export default BookingPage;
