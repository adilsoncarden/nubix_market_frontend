import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; // 1. Importa la nueva página
import "./App.css"; 

function App() {
    return (
        <Router>
            <div className="min-vh-100 d-flex flex-column">
                <Navbar />
                <main className="d-flex flex-column flex-grow-1">
                    <Routes>
                        <Route path="/" element={<MainContent />} />
                        <Route path="/login" element={<Login />} />
                        {/* 2. Agrega la ruta de registro */}
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;