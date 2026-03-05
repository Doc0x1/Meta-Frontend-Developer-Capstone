import { render, screen } from "@testing-library/react";
import App from "./App";

/* ============================================================
   App-level smoke tests
   ============================================================ */

test("renders the site header", () => {
  render(<App />);
  // "Little Lemon" appears in both the header logo and the hero h1;
  // we use getAllByText and confirm at least one element is present.
  expect(screen.getAllByText(/little lemon/i).length).toBeGreaterThan(0);
});

test("renders the Home navigation link", () => {
  render(<App />);
  expect(screen.getByRole("link", { name: /^home$/i })).toBeInTheDocument();
});

test("renders the Reservations navigation link", () => {
  render(<App />);
  expect(screen.getByRole("link", { name: /reservations/i })).toBeInTheDocument();
});
