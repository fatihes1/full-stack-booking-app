import './App.css'
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import { Auth } from "./pages/auth/Auth"
import { Event } from "./pages/event/Event"
import { Booking } from "./pages/booking/Booking"
import {MainNavigation} from "./components/navigation/MainNavigation.jsx";
import AuthContext from "./context/auth-context.jsx";
import {useState} from "react";

function App() {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const login = (token, userId, tokenExpiration) => {
        setToken(token);
        setUserId(userId);
    };

    const logout = () => {
        setToken(null)
        setUserId(null)
    };

  return (
    <BrowserRouter>
        <AuthContext.Provider value={{
            token: token,
            userId: userId,
            login: login,
            logout: logout,
        }}>
      <MainNavigation />
        <main className={'main-content'}>
            <Routes>
                {
                    !token && <Route
                        path="/"
                        element={<Navigate to="/auth" />}
                    />
                }
                {
                    token && <Route
                        path="/auth"
                        element={<Navigate to="/events" />}
                    />
                }
                {
                    !token && <Route path="/auth" element={<Auth />} />
                }
                <Route path="/events" element={<Event />} />
                {
                    token && <Route path="/bookings" element={<Booking />} />
                }
            </Routes>
        </main>
        </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App
