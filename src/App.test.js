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
  // Home link appears in both header and footer nav
  expect(screen.getAllByRole("link", { name: /^home$/i }).length).toBeGreaterThan(0);
});

test("renders the Reservations navigation link", () => {
  render(<App />);
  // Reservations link appears in both header and footer nav
  expect(screen.getAllByRole("link", { name: /reservations/i }).length).toBeGreaterThan(0);
});
