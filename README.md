# Little Lemon — Table Reservation App

A React web application for the **Little Lemon** Mediterranean restaurant in Chicago, built as the capstone project for the Meta Front-End Developer Professional Certificate.

---

## Features

- **Table reservation form** — select a date, available time slot, party size, and occasion, with full client-side validation and accessible error messages
- **React Router navigation** — separate pages for Home (`/`), Reservations (`/reservations`), and Booking Confirmation (`/confirmed`)
- **Accessible UI** — semantic HTML, ARIA labels, live regions for errors, keyboard-navigable controls, and focus rings
- **Responsive layout** — CSS custom properties + grid/flexbox adapts from mobile to desktop
- **Unit tests** — Jest + React Testing Library covering the reducer, form rendering, validation, and submission

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (bundled with Node.js)

### Installation

```bash
git clone <your-repo-url>
cd little-lemon
npm install
```

### Running the app

```bash
npm start
```

Opens [http://localhost:3000](http://localhost:3000) in your browser. The page reloads automatically when you save changes.

### Running the tests

```bash
npm test
```

Launches Jest in interactive watch mode. Press `a` to run all tests.

### Building for production

```bash
npm run build
```

Outputs optimised static files to the `build/` folder.

---

## Project Structure

```
src/
├── api.js                        # fetchAPI + submitAPI mock functions
├── App.js                        # BrowserRouter + route definitions
├── App.css                       # Global CSS custom properties (design tokens)
├── App.test.js                   # App-level smoke tests
├── components/
│   ├── Header/
│   │   ├── Header.js             # Site header with logo and nav
│   │   └── Header.css
│   ├── Nav/
│   │   ├── Nav.js                # Primary navigation links
│   │   └── Nav.css
│   └── BookingForm/
│       ├── BookingForm.js        # Controlled form with validation logic
│       ├── BookingForm.css
│       └── BookingForm.test.js   # Unit tests for the form
└── pages/
    ├── HomePage/
    │   ├── HomePage.js           # Hero section (landing page)
    │   └── HomePage.css
    ├── BookingPage/
    │   ├── BookingPage.js        # Hosts BookingForm; manages times via useReducer
    │   └── BookingPage.css
    └── ConfirmedBooking/
        ├── ConfirmedBooking.js   # Booking confirmation summary
        └── ConfirmedBooking.css
```

---

## Design Decisions

### State management — `useReducer` for available times

The `timesReducer` in `BookingPage.js` follows the pattern taught in the Meta course. When the user picks a date, a `UPDATE_TIMES` action is dispatched, and the reducer calls `fetchAPI(date)` to derive the new list of available time slots. This keeps the time-fetching logic pure and easy to unit-test.

### Form validation

Validation runs on every render (derived state from `fields`), so the form always knows whether it is valid. Errors are shown:
- **On blur** — after the user leaves a field
- **On submit** — all fields are checked at once

This avoids showing errors before the user has had a chance to fill a field, while still catching everything on submit.

### Accessibility

- All inputs are associated with a `<label>` via `htmlFor`/`id` pairs
- `aria-required="true"` on mandatory fields
- `aria-invalid` toggled when a field has an error
- `aria-describedby` links each input to its error message
- Error messages use `role="alert"` so screen readers announce them immediately
- A form-level `aria-live="polite"` region announces the error summary on submit
- Focus rings are preserved via `focus-visible` CSS

---

## Accessibility Statement

This application was built with web accessibility in mind, following WCAG 2.1 AA guidelines:
- Colour contrast meets the 4.5:1 minimum ratio for text
- All interactive elements are keyboard navigable
- Landmark regions (`<header>`, `<main>`, `<section>`) provide document structure
- Form errors are programmatically associated with their inputs

---

## Technologies

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI library |
| React Router DOM | 6 | Client-side routing |
| React Testing Library | 16 | Component testing |
| Jest (via react-scripts) | — | Test runner |
| Create React App | 5 | Build tooling |
