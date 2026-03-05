import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import BookingPage from "./pages/BookingPage/BookingPage";
import ConfirmedBooking from "./pages/ConfirmedBooking/ConfirmedBooking";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      {/* Persistent header/navigation across all pages */}
      <Header />
      <main aria-label="Main content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reservations" element={<BookingPage />} />
          <Route path="/confirmed" element={<ConfirmedBooking />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
