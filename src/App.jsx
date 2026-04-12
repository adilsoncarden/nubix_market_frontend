import React from "react";
import Login from "./pages/Login"; // Asegúrate de que este archivo exista en src/pages
import "./App.css"; 

function App() {
    return (
        <div className="min-vh-100">
            {/* Quitamos el Navbar y Footer temporalmente para ver solo el Login */}
            <Login />
        </div>
    );
}

export default App;