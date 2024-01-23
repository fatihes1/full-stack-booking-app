import './App.css'
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import { Auth } from "./pages/auth/Auth"
import { Event } from "./pages/event/Event"
import { Booking } from "./pages/booking/Booking"

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
      <Route
          path="/"
          element={<Navigate to="/auth" />}
        />
        <Route path="/auth" element={<Auth />}  />
        <Route path="/events" element={<Event />} />
        <Route path="/bookings" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
