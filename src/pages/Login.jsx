import React from "react";
import logoImage from "../assets/logo.png";

function Login() {
  const styles = {
    loginPage: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#f0fdf4", 
      fontFamily: "sans-serif",
    },
    // NAVBAR: Se mantiene igual a como lo configuramos
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 50px",
      backgroundColor: "#22c55e",
      color: "white",
    },
    searchContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.2)", 
      borderRadius: "8px",
      padding: "5px 15px",
      width: "500px", 
      marginLeft: "20px",
    },
    searchInput: {
      background: "none",
      border: "none",
      color: "white",
      padding: "5px 5px 5px 25px",
      fontSize: "0.9rem",
      width: "100%",
      outline: "none",
    },
    mainContent: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    // TARJETA: Estilo limpio y funcional
    card: {
      backgroundColor: "white",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
    },
    iconCircle: {
      width: "60px",
      height: "60px",
      backgroundColor: "#f0fdf4",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "0 auto 20px",
      color: "#22c55e",
      fontSize: "24px",
      border: "1px solid #dcfce7"
    },
    inputGroup: {
      textAlign: "left",
      marginBottom: "20px",
    },
    label: {
      fontSize: "0.9rem",
      color: "#333",
      fontWeight: "bold",
      display: "block",
      marginBottom: "8px"
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "1rem",
      boxSizing: "border-box",
    },
    submitButton: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#22c55e",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "10px"
    },
  };

  return (
    <div style={styles.loginPage}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "50%", padding: "5px", display: "flex" }}>
              <img src={logoImage} alt="Logo" style={{ height: "25px" }} />
            </div>
            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>NUBIX MARKET</span>
          </div>

          <div style={styles.searchContainer}>
            <span style={{ position: "absolute", left: "10px" }}>🔍</span>
            <input type="text" placeholder="Buscar productos..." style={styles.searchInput} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
          <span>Inicio</span>
          <span>Tienda</span>
          <span>Acceder</span>
          <span style={{ fontSize: "1.2rem" }}>🛒</span>
        </div>
      </nav>

      {/* LOGIN */}
      <main style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.iconCircle}>🛒</div> 
          
          <h2 style={{ marginBottom: "10px" }}>Iniciar Sesión</h2>
          <p style={{ color: "#666", marginBottom: "30px", fontSize: "0.9rem" }}>
            Ingresa tus credenciales para continuar
          </p>

          <form>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Correo Electrónico</label>
              <input type="email" style={styles.input} placeholder="correo@ejemplo.com" />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Contraseña</label>
              <input type="password" style={styles.input} placeholder="********" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input type="checkbox" /> Recordarme
              </label>
              <a href="#" style={{ color: "#22c55e", textDecoration: "none" }}>¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" style={styles.submitButton}>
              Entrar
            </button>
          </form>

          <p style={{ marginTop: "25px", fontSize: "0.9rem", color: "#666" }}>
            ¿Nuevo por aquí? <span style={{ color: "#22c55e", fontWeight: "bold", cursor: "pointer" }}>Regístrate</span>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;