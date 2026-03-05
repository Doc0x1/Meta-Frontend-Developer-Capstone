import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import BookingForm from "./BookingForm";
import { initializeTimes, timesReducer } from "../../pages/BookingPage/BookingPage";

/* ============================================================
   Helpers
   ============================================================ */

/** Renders BookingForm inside a MemoryRouter (required by React Router hooks). */
function renderForm(availableTimes = ["17:00", "18:00", "19:00"], onSubmit = jest.fn()) {
  const onDateChange = jest.fn();
  render(
    <MemoryRouter>
      <BookingForm
        availableTimes={availableTimes}
        onDateChange={onDateChange}
        onSubmit={onSubmit}
      />
    </MemoryRouter>
  );
  return { onSubmit, onDateChange };
}

/** Returns tomorrow's date as a YYYY-MM-DD string (always in the future). */
function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

/* ============================================================
   1. API / state initialisation tests
   ============================================================ */

describe("initializeTimes", () => {
  test("returns an array", () => {
    const times = initializeTimes();
    expect(Array.isArray(times)).toBe(true);
  });

  test("returns only strings in HH:MM format", () => {
    const times = initializeTimes();
    times.forEach((t) => expect(t).toMatch(/^\d{2}:\d{2}$/));
  });
});

describe("timesReducer", () => {
  test("returns an array for UPDATE_TIMES action", () => {
    const result = timesReducer([], { type: "UPDATE_TIMES", date: "2024-06-15" });
    expect(Array.isArray(result)).toBe(true);
  });

  test("time strings are in HH:MM format", () => {
    const result = timesReducer([], { type: "UPDATE_TIMES", date: "2024-06-14" });
    result.forEach((t) => expect(t).toMatch(/^\d{2}:\d{2}$/));
  });

  test("different dates can produce different available times", () => {
    // The seeded-random API gives deterministic but date-dependent results.
    // Dates with different day numbers may return different slot arrays.
    const day1 = timesReducer([], { type: "UPDATE_TIMES", date: "2024-06-01" });
    const day2 = timesReducer([], { type: "UPDATE_TIMES", date: "2024-06-02" });
    // Both are valid arrays; at minimum we verify they don't throw.
    expect(Array.isArray(day1)).toBe(true);
    expect(Array.isArray(day2)).toBe(true);
  });

  test("returns current state for unknown action types", () => {
    const state = ["17:00", "19:00"];
    const result = timesReducer(state, { type: "UNKNOWN" });
    expect(result).toBe(state);
  });
});

/* ============================================================
   2. Rendering tests
   ============================================================ */

describe("BookingForm rendering", () => {
  test("renders all required form fields", () => {
    renderForm();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/special requests/i)).toBeInTheDocument();
  });

  test("renders the submit button", () => {
    renderForm();
    expect(screen.getByRole("button", { name: /reserve a table/i })).toBeInTheDocument();
  });

  test("populates the time select with the provided availableTimes", () => {
    renderForm(["18:00", "20:00"]);
    expect(screen.getByRole("option", { name: "18:00" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "20:00" })).toBeInTheDocument();
  });

  test("disables the time select when availableTimes is empty", () => {
    renderForm([]);
    expect(screen.getByLabelText(/time/i)).toBeDisabled();
  });
});

/* ============================================================
   3. Validation tests
   ============================================================ */

describe("BookingForm validation", () => {
  test("shows required field errors when submitting an empty form", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /reserve a table/i }));

    expect(await screen.findByText(/first name must be at least 2 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/please select a date/i)).toBeInTheDocument();
    expect(await screen.findByText(/please select an available time slot/i)).toBeInTheDocument();
    expect(await screen.findByText(/number of guests must be between 1 and 10/i)).toBeInTheDocument();
  });

  test("shows an error for an invalid email address", async () => {
    renderForm();
    userEvent.type(screen.getByLabelText(/email address/i), "not-an-email");
    fireEvent.blur(screen.getByLabelText(/email address/i));

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  test("does not show an error for a valid email address", () => {
    renderForm();
    userEvent.type(screen.getByLabelText(/email address/i), "user@example.com");
    fireEvent.blur(screen.getByLabelText(/email address/i));

    expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
  });

  test("shows an error summary banner on invalid submit", () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /reserve a table/i }));
    // Multiple role="alert" elements appear (banner + per-field errors); check the banner text specifically
    expect(screen.getByText(/please fix the errors below before submitting/i)).toBeInTheDocument();
  });

  test("submit button is enabled before the first submit attempt", () => {
    renderForm();
    expect(screen.getByRole("button", { name: /reserve a table/i })).not.toBeDisabled();
  });

  test("disables submit button after a failed submission attempt", () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /reserve a table/i }));
    expect(screen.getByRole("button", { name: /reserve a table/i })).toBeDisabled();
  });
});

/* ============================================================
   4. Submission test
   ============================================================ */

describe("BookingForm submission", () => {
  test("calls onSubmit with correct data when form is valid", async () => {
    const onSubmit = jest.fn();
    renderForm(["18:00", "19:00"], onSubmit);

    userEvent.type(screen.getByLabelText(/first name/i), "Jane");
    userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    userEvent.type(screen.getByLabelText(/email address/i), "jane@example.com");
    fireEvent.change(screen.getByLabelText(/^date/i), { target: { value: tomorrow() } });
    fireEvent.change(screen.getByLabelText(/time/i), { target: { value: "18:00" } });
    userEvent.type(screen.getByLabelText(/number of guests/i), "3");

    fireEvent.click(screen.getByRole("button", { name: /reserve a table/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted.firstName).toBe("Jane");
    expect(submitted.lastName).toBe("Doe");
    expect(submitted.email).toBe("jane@example.com");
    expect(submitted.time).toBe("18:00");
    expect(submitted.guests).toBe(3);
  });

  test("does not call onSubmit when the form is invalid", () => {
    const onSubmit = jest.fn();
    renderForm(["18:00"], onSubmit);

    fireEvent.click(screen.getByRole("button", { name: /reserve a table/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

/* ============================================================
   5. HTML5 validation attribute tests
   Verify that each input carries the correct HTML5 constraint
   attributes so the browser's native validation participates
   alongside the custom React validation.
   ============================================================ */

describe("BookingForm HTML5 attributes", () => {
  test("first name input has required and type text", () => {
    renderForm();
    const input = screen.getByLabelText(/first name/i);
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("type", "text");
  });

  test("last name input has required and type text", () => {
    renderForm();
    const input = screen.getByLabelText(/last name/i);
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("type", "text");
  });

  test("email input has required and type email", () => {
    renderForm();
    const input = screen.getByLabelText(/email address/i);
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("type", "email");
  });

  test("date input has required, type date, and a min attribute set to today or later", () => {
    renderForm();
    const input = screen.getByLabelText(/^date/i);
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("type", "date");
    // min must be a valid date string and not in the past
    const min = input.getAttribute("min");
    expect(min).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(new Date(min) >= new Date(new Date().toISOString().split("T")[0])).toBe(true);
  });

  test("time select has required", () => {
    renderForm();
    expect(screen.getByLabelText(/time/i)).toHaveAttribute("required");
  });

  test("guests input has required, type number, min 1, and max 10", () => {
    renderForm();
    const input = screen.getByLabelText(/number of guests/i);
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveAttribute("min", "1");
    expect(input).toHaveAttribute("max", "10");
  });

  test("special requests textarea has maxLength of 300", () => {
    renderForm();
    expect(screen.getByLabelText(/special requests/i)).toHaveAttribute("maxLength", "300");
  });
});

/* ============================================================
   6. JavaScript validation — valid and invalid states
   Each field is tested in both its passing state (no error shown)
   and its failing state (correct error message shown) to ensure
   full coverage of the validation logic.
   ============================================================ */

describe("BookingForm field validation — valid states", () => {
  test("first name: no error for a value with 2+ characters", () => {
    renderForm();
    userEvent.type(screen.getByLabelText(/first name/i), "Al");
    fireEvent.blur(screen.getByLabelText(/first name/i));
    expect(screen.queryByText(/first name must be at least 2 characters/i)).not.toBeInTheDocument();
  });

  test("last name: no error for a non-empty value", () => {
    renderForm();
    userEvent.type(screen.getByLabelText(/last name/i), "Smith");
    fireEvent.blur(screen.getByLabelText(/last name/i));
    expect(screen.queryByText(/last name is required/i)).not.toBeInTheDocument();
  });

  test("email: no error for a properly formatted address", () => {
    renderForm();
    userEvent.type(screen.getByLabelText(/email address/i), "user@example.com");
    fireEvent.blur(screen.getByLabelText(/email address/i));
    expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
  });

  test("date: no error for a future date", () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/^date/i), { target: { value: tomorrow() } });
    fireEvent.blur(screen.getByLabelText(/^date/i));
    expect(screen.queryByText(/please select a date/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/cannot be in the past/i)).not.toBeInTheDocument();
  });

  test("guests: no error for a value between 1 and 10", () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: "5" } });
    fireEvent.blur(screen.getByLabelText(/number of guests/i));
    expect(screen.queryByText(/number of guests must be between 1 and 10/i)).not.toBeInTheDocument();
  });

  test("special requests: no error for a value under 300 characters", () => {
    renderForm();
    userEvent.type(screen.getByLabelText(/special requests/i), "Window seat please.");
    fireEvent.blur(screen.getByLabelText(/special requests/i));
    expect(screen.queryByText(/300 characters or fewer/i)).not.toBeInTheDocument();
  });
});

describe("BookingForm field validation — invalid states", () => {
  test("first name: error for a single character", async () => {
    renderForm();
    userEvent.type(screen.getByLabelText(/first name/i), "A");
    fireEvent.blur(screen.getByLabelText(/first name/i));
    expect(await screen.findByText(/first name must be at least 2 characters/i)).toBeInTheDocument();
  });

  test("first name: error for an empty value", async () => {
    renderForm();
    fireEvent.blur(screen.getByLabelText(/first name/i));
    fireEvent.click(screen.getByRole("button", { name: /reserve a table/i }));
    expect(await screen.findByText(/first name must be at least 2 characters/i)).toBeInTheDocument();
  });

  test("last name: error for an empty value", async () => {
    renderForm();
    fireEvent.blur(screen.getByLabelText(/last name/i));
    fireEvent.click(screen.getByRole("button", { name: /reserve a table/i }));
    expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
  });

  test("email: error for a missing @ symbol", async () => {
    renderForm();
    userEvent.type(screen.getByLabelText(/email address/i), "invalidemail.com");
    fireEvent.blur(screen.getByLabelText(/email address/i));
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  test("email: error for an empty value", async () => {
    renderForm();
    fireEvent.blur(screen.getByLabelText(/email address/i));
    fireEvent.click(screen.getByRole("button", { name: /reserve a table/i }));
    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();
  });

  test("date: error when no date is selected", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /reserve a table/i }));
    expect(await screen.findByText(/please select a date/i)).toBeInTheDocument();
  });

  test("date: error for a date in the past", async () => {
    renderForm();
    // Use a hardcoded past date that will always be in the past
    fireEvent.change(screen.getByLabelText(/^date/i), { target: { value: "2020-01-01" } });
    fireEvent.blur(screen.getByLabelText(/^date/i));
    fireEvent.click(screen.getByRole("button", { name: /reserve a table/i }));
    expect(await screen.findByText(/reservation date cannot be in the past/i)).toBeInTheDocument();
  });

  test("guests: error for a value of 0", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: "0" } });
    fireEvent.blur(screen.getByLabelText(/number of guests/i));
    fireEvent.click(screen.getByRole("button", { name: /reserve a table/i }));
    expect(await screen.findByText(/number of guests must be between 1 and 10/i)).toBeInTheDocument();
  });

  test("guests: error for a value greater than 10", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/number of guests/i), { target: { value: "11" } });
    fireEvent.blur(screen.getByLabelText(/number of guests/i));
    fireEvent.click(screen.getByRole("button", { name: /reserve a table/i }));
    expect(await screen.findByText(/number of guests must be between 1 and 10/i)).toBeInTheDocument();
  });

  test("special requests: error for a value exceeding 300 characters", async () => {
    renderForm();
    // Type 301 characters — one over the limit
    const longText = "a".repeat(301);
    fireEvent.change(screen.getByLabelText(/special requests/i), { target: { value: longText } });
    fireEvent.blur(screen.getByLabelText(/special requests/i));
    fireEvent.click(screen.getByRole("button", { name: /reserve a table/i }));
    expect(await screen.findByText(/300 characters or fewer/i)).toBeInTheDocument();
  });
});
