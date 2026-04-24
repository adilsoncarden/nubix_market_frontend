import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Categorias from "./pages/Categorias";
import "./App.css";

function AppContent() {
    const location = useLocation();
    
    // Convertimos a minúsculas para asegurar que detecte la ruta correctamente
    const isDashboard = 
        location.pathname.toLowerCase() === "/dashboard" || 
        location.pathname.toLowerCase() === "/categorias";

    return (
        <div className="min-vh-100 d-flex flex-column">
            {!isDashboard && <Navbar />}
            
            <main className="d-flex flex-column flex-grow-1">
                <div className="flex-grow-1 d-flex flex-column">
                    <Routes>
                        <Route path="/" element={<MainContent />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        {/* Usamos minúsculas aquí también por estándar de frontend */}
                        <Route path="/categorias" element={<Categorias />} />
                    </Routes>
                </div>
            </main>

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