import React, { useState } from "react";
// REVISA ESTAS RUTAS: Si tus archivos se llaman distinto o están en otra carpeta, cámbialas.
import Navbar from "./components/Navbar"; 
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import Register from "./pages/Register"; // ¿Tu carpeta se llama "pages" o "components"?
import "./App.css";

function App() {
  const [pantallaActual, setPantallaActual] = useState("home");

  // Esta función envuelve todo para que, si algo falla, no bloquee toda la página
  return (
    <div className="min-vh-100 d-flex flex-column">
      {pantallaActual === "home" ? (
        <>
          {/* Aquí pasamos las funciones para cambiar el estado */}
          <Navbar 
            alHacerClickLogin={() => setPantallaActual("registro")} 
            alHacerClickVolver={() => setPantallaActual("home")} 
          />
          <MainContent />
          <Footer />
        </>
      ) : (
        /* Cuando el estado sea "registro", solo se verá esto */
        <Register alHacerClickVolver={() => setPantallaActual("home")} />
      )}
    </div>
  );
}

export default App;