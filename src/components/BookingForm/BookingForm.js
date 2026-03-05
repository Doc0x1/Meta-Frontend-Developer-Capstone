import { useState } from "react";
import "./BookingForm.css";

/* ============================================================
   Validation helpers
   ============================================================ */

/** Returns today's date string in YYYY-MM-DD format for the min attribute. */
function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

/** Validates a single email address string. */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validates the entire form data object.
 * Returns an errors object — keys map to field names, values are error strings.
 * An empty object means the form is valid.
 */
function validate(fields) {
  const errors = {};

  if (!fields.firstName.trim() || fields.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  }
  if (!fields.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }
  if (!fields.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!isValidEmail(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!fields.date) {
    errors.date = "Please select a date.";
  } else if (fields.date < getTodayString()) {
    errors.date = "Reservation date cannot be in the past.";
  }
  if (!fields.time) {
    errors.time = "Please select an available time slot.";
  }
  const guests = Number(fields.guests);
  if (!fields.guests || isNaN(guests) || guests < 1 || guests > 10) {
    errors.guests = "Number of guests must be between 1 and 10.";
  }
  if (fields.specialRequests && fields.specialRequests.length > 300) {
    errors.specialRequests = "Special requests must be 300 characters or fewer.";
  }

  return errors;
}

/* ============================================================
   BookingForm component
   ============================================================ */

/**
 * Controlled booking form for table reservations.
 *
 * Props:
 *  - availableTimes {string[]}  — time slots populated by the parent via fetchAPI
 *  - onDateChange   {Function}  — called with the selected date string so the
 *                                 parent can dispatch UPDATE_TIMES
 *  - onSubmit       {Function}  — called with the validated form data object;
 *                                 the parent calls submitAPI and navigates on success
 */
function BookingForm({ availableTimes, onDateChange, onSubmit }) {
  /* ---- State ---- */
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    date: "",
    time: "",
    guests: "",
    occasion: "",
    specialRequests: "",
  });

  // Track which fields have been "touched" (blurred at least once)
  // so we only show errors after the user has interacted with a field.
  const [touched, setTouched] = useState({});

  // Errors derived from the current field values
  const [submitAttempted, setSubmitAttempted] = useState(false);

  /* ---- Derived state ---- */
  const errors = validate(fields);
  const isFormValid = Object.keys(errors).length === 0;

  // Show an error for a field if it has been touched OR a submit was attempted
  const shouldShowError = (fieldName) =>
    (touched[fieldName] || submitAttempted) && errors[fieldName];

  /* ---- Handlers ---- */
  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));

    // When the date changes, notify the parent to update available times
    if (name === "date") {
      onDateChange(value);
      // Reset the time selection so the user picks from the new list
      setFields((prev) => ({ ...prev, date: value, time: "" }));
    }
  }

  function handleBlur(e) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isFormValid) return;

    onSubmit({
      firstName: fields.firstName.trim(),
      lastName: fields.lastName.trim(),
      email: fields.email.trim(),
      date: fields.date,
      time: fields.time,
      guests: Number(fields.guests),
      occasion: fields.occasion,
      specialRequests: fields.specialRequests.trim(),
    });
  }

  /* ---- Render ---- */
  return (
    <form
      className="booking-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Table reservation form"
    >
      {/* Live region so screen readers announce form-level issues on submit */}
      {submitAttempted && !isFormValid && (
        <div
          role="alert"
          aria-live="polite"
          className="booking-form__error-summary"
        >
          Please fix the errors below before submitting.
        </div>
      )}

      {/* ---- Personal details ---- */}
      <fieldset className="booking-form__fieldset">
        <legend className="booking-form__legend">Contact details</legend>

        <div className="booking-form__row">
          {/* First name */}
          <div className="booking-form__field">
            <label htmlFor="firstName" className="booking-form__label">
              First name <span aria-hidden="true">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={fields.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-required="true"
              aria-describedby={shouldShowError("firstName") ? "firstName-error" : undefined}
              aria-invalid={shouldShowError("firstName") ? "true" : "false"}
              className={`booking-form__input${shouldShowError("firstName") ? " booking-form__input--error" : ""}`}
              autoComplete="given-name"
            />
            {shouldShowError("firstName") && (
              <p id="firstName-error" className="booking-form__error" role="alert">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last name */}
          <div className="booking-form__field">
            <label htmlFor="lastName" className="booking-form__label">
              Last name <span aria-hidden="true">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={fields.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-required="true"
              aria-describedby={shouldShowError("lastName") ? "lastName-error" : undefined}
              aria-invalid={shouldShowError("lastName") ? "true" : "false"}
              className={`booking-form__input${shouldShowError("lastName") ? " booking-form__input--error" : ""}`}
              autoComplete="family-name"
            />
            {shouldShowError("lastName") && (
              <p id="lastName-error" className="booking-form__error" role="alert">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="booking-form__field">
          <label htmlFor="email" className="booking-form__label">
            Email address <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={fields.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-required="true"
            aria-describedby={shouldShowError("email") ? "email-error" : undefined}
            aria-invalid={shouldShowError("email") ? "true" : "false"}
            className={`booking-form__input${shouldShowError("email") ? " booking-form__input--error" : ""}`}
            autoComplete="email"
          />
          {shouldShowError("email") && (
            <p id="email-error" className="booking-form__error" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </fieldset>

      {/* ---- Reservation details ---- */}
      <fieldset className="booking-form__fieldset">
        <legend className="booking-form__legend">Reservation details</legend>

        <div className="booking-form__row">
          {/* Date */}
          <div className="booking-form__field">
            <label htmlFor="date" className="booking-form__label">
              Date <span aria-hidden="true">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={fields.date}
              min={getTodayString()}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-required="true"
              aria-describedby={shouldShowError("date") ? "date-error" : undefined}
              aria-invalid={shouldShowError("date") ? "true" : "false"}
              className={`booking-form__input${shouldShowError("date") ? " booking-form__input--error" : ""}`}
            />
            {shouldShowError("date") && (
              <p id="date-error" className="booking-form__error" role="alert">
                {errors.date}
              </p>
            )}
          </div>

          {/* Time */}
          <div className="booking-form__field">
            <label htmlFor="time" className="booking-form__label">
              Time <span aria-hidden="true">*</span>
            </label>
            <select
              id="time"
              name="time"
              value={fields.time}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-required="true"
              aria-describedby={shouldShowError("time") ? "time-error" : undefined}
              aria-invalid={shouldShowError("time") ? "true" : "false"}
              className={`booking-form__select${shouldShowError("time") ? " booking-form__input--error" : ""}`}
              disabled={availableTimes.length === 0}
            >
              <option value="">
                {availableTimes.length === 0
                  ? "— select a date first —"
                  : "— choose a time —"}
              </option>
              {availableTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {shouldShowError("time") && (
              <p id="time-error" className="booking-form__error" role="alert">
                {errors.time}
              </p>
            )}
          </div>
        </div>

        <div className="booking-form__row">
          {/* Guests */}
          <div className="booking-form__field">
            <label htmlFor="guests" className="booking-form__label">
              Number of guests <span aria-hidden="true">*</span>
            </label>
            <input
              id="guests"
              name="guests"
              type="number"
              value={fields.guests}
              min="1"
              max="10"
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-required="true"
              aria-describedby={shouldShowError("guests") ? "guests-error" : "guests-hint"}
              aria-invalid={shouldShowError("guests") ? "true" : "false"}
              className={`booking-form__input${shouldShowError("guests") ? " booking-form__input--error" : ""}`}
            />
            <p id="guests-hint" className="booking-form__hint">
              Maximum 10 guests per reservation.
            </p>
            {shouldShowError("guests") && (
              <p id="guests-error" className="booking-form__error" role="alert">
                {errors.guests}
              </p>
            )}
          </div>

          {/* Occasion */}
          <div className="booking-form__field">
            <label htmlFor="occasion" className="booking-form__label">
              Occasion <span className="booking-form__optional">(optional)</span>
            </label>
            <select
              id="occasion"
              name="occasion"
              value={fields.occasion}
              onChange={handleChange}
              className="booking-form__select"
            >
              <option value="">— none —</option>
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Business">Business dinner</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Special requests */}
        <div className="booking-form__field">
          <label htmlFor="specialRequests" className="booking-form__label">
            Special requests{" "}
            <span className="booking-form__optional">(optional)</span>
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={fields.specialRequests}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={300}
            rows={4}
            aria-describedby={
              shouldShowError("specialRequests")
                ? "specialRequests-error"
                : "specialRequests-hint"
            }
            aria-invalid={shouldShowError("specialRequests") ? "true" : "false"}
            className={`booking-form__textarea${shouldShowError("specialRequests") ? " booking-form__input--error" : ""}`}
            placeholder="Dietary requirements, seating preferences, accessibility needs…"
          />
          <p id="specialRequests-hint" className="booking-form__hint">
            {fields.specialRequests.length}/300 characters
          </p>
          {shouldShowError("specialRequests") && (
            <p id="specialRequests-error" className="booking-form__error" role="alert">
              {errors.specialRequests}
            </p>
          )}
        </div>
      </fieldset>

      {/* ---- Submit ---- */}
      <button
        type="submit"
        className="booking-form__submit"
        disabled={submitAttempted && !isFormValid}
      >
        Reserve a table
      </button>
    </form>
  );
}

export default BookingForm;
