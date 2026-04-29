import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Categorias from "./pages/Categorias"; // Este será tu Dashboard principal
import "./App.css";

function AppContent() {
    return (
        <div className="min-vh-100 d-flex flex-column">
            <Routes>
                {/* RUTAS PÚBLICAS (Con Navbar y Footer) */}
                <Route path="/" element={<><Navbar /><MainContent /><Footer /></>} />
                <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
                <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />

                {/* RUTA DEL DASHBOARD (Categorias gestiona internamente Clientes y Productos) */}
                <Route path="/categorias" element={<Categorias />} />
                
                {/* 
                   BORRA LA RUTA /clientes DE AQUÍ. 
                   Ahora Clientes vive dentro de Categorias.jsx 
                */}
            </Routes>
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