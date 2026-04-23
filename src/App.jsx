import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";

// Creamos un componente interno para poder usar useLocation
function AppContent() {
    const location = useLocation();
    
    // Definimos en qué ruta queremos ocultar el Navbar y Footer
    const isDashboard = location.pathname === "/dashboard";

    return (
        <div className="min-vh-100 d-flex flex-column">
            {/* Solo muestra el Navbar si NO estamos en dashboard */}
            {!isDashboard && <Navbar />}
            
            <main className="d-flex flex-column flex-grow-1">
                <div className="flex-grow-1 d-flex flex-column">
                    <Routes>
                        <Route path="/" element={<MainContent />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </div>
            </main>

            {/* Solo muestra el Footer si NO estamos en dashboard */}
            {!isDashboard && <Footer />}
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;