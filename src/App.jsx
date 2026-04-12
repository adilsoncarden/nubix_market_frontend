import React from "react";
import Navbar from "./components/Navbar"; // Ajusta la ruta si es necesario
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import "./App.css"; // Archivo CSS para estilos personalizados

function App() {
    return (
        // "min-vh-100" asegura que el sitio ocupe toda la pantalla
        // "d-flex flex-column" ayuda a que el footer se quede abajo si hay poco contenido
        <div className="min-vh-100 d-flex flex-column">
            {/* 1. Navegación superior */}
            <Navbar />

            {/* 2. Contenido dinámico (Main) */}
            <MainContent />

            {/* 3. Pie de página */}
            <Footer />
        </div>
    );
}

export default App;
