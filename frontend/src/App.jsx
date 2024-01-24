import './App.css'
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import { Auth } from "./pages/auth/Auth"
import { Event } from "./pages/event/Event"
import { Booking } from "./pages/booking/Booking"
import {MainNavigation} from "./components/navigation/MainNavigation.jsx";


function App() {
  

  return (
    <BrowserRouter>
      <MainNavigation />
        <main className={'main-content'}>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/auth" />}
                />
                <Route path="/auth" element={<Auth />}  />
                <Route path="/events" element={<Event />} />
                <Route path="/bookings" element={<Booking />} />
            </Routes>
        </main>
    </BrowserRouter>
  )
}

export default App
