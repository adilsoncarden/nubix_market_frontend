import React from "react";
import logoImage from "../assets/logo.png";

function Login() {
  const styles = {
    // 1. FONDO GENERAL: Verde menta clarito y centrado total
    loginPage: {
      display: "flex",
      flexDirection: "column", // Para que el Navbar esté arriba y el contenido abajo
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#f0fdf4", // El verde clarito de la imagen
      fontFamily: "'Inter', sans-serif",
    },
    // 2. NAVBAR: Barra superior verde
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 50px",
      backgroundColor: "#22c55e", // Verde vibrante
      color: "white",
    },
    navLinks: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
    },
    // 3. CONTENEDOR DE LA TARJETA
    mainContent: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    // 4. LA TARJETA BLANCA (Card)
    card: {
      backgroundColor: "white",
      padding: "40px",
      borderRadius: "16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      width: "100%",
      maxWidth: "450px",
      textAlign: "center", // Centra el texto y el icono
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
    title: {
      fontSize: "1.8rem",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "0.95rem",
      color: "#6b7280",
      marginBottom: "30px",
    },
    inputGroup: {
      textAlign: "left",
      marginBottom: "20px",
      position: "relative",
    },
    input: {
      width: "100%",
      padding: "12px 12px 12px 40px", // Espacio para el icono a la izquierda
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      fontSize: "1rem",
      backgroundColor: "#fff",
      boxSizing: "border-box", // Evita que el input se salga del borde
    },
    rowBetween: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "0.85rem",
      marginBottom: "25px",
    },
    submitButton: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#22c55e", // Verde del botón
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background 0.3s",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px"
    },
    searchContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      // CAMBIA ESTA LÍNEA:
      backgroundColor: "rgba(255, 255, 255, 0.2)", 
      borderRadius: "8px",
      padding: "5px 15px",
      width: "500px",
      marginLeft: "30px",
    },
    searchInput: {
      background: "none",
      border: "none",
      color: "white",
      padding: "5px 5px 5px 20px",
      fontSize: "0.9rem",
      width: "100%",
      outline: "none",
    },
    searchIcon: {
      position: "absolute",
      left: "10px",
      color: "white",
      fontSize: "0.8rem"
    },
  };

  return (
    <div style={styles.loginPage}>
      {/* Barra de Navegación */}
      {/* Barra de Navegación */}
      <nav style={styles.navbar}>
        {/* Este div agrupa el Logo, el Nombre y el Buscador a la izquierda */}
        <div style={{ display: "flex", alignItems: "center" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "50%", padding: "5px", display: "flex" }}>
              <img src={logoImage} alt="S" style={{ height: "25px" }} />
            </div>
          <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>SuperMarket</span>
        </div>

          {/* AQUÍ ESTÁ EL BUSCADOR QUE TE FALTABA */}
        <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Search for products..." 
              style={styles.searchInput} 
            />
              </div>
        </div>

        {/* Los links de la derecha se mantienen igual */}
        <div style={styles.navLinks}>
          <span>Home</span>
          <span>Shop</span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>👤 Login</span>
          <span>🛒</span>
        </div>
      </nav>

      {/* Contenido Principal con la Tarjeta */}
      <main style={styles.mainContent}>
        <div style={styles.card}>
          {/* Icono del Candado */}
          <div style={styles.iconCircle}>🔒</div>

          <h2 style={styles.title}>Sign in to your account</h2>
          <p style={styles.subtitle}>
            Or <span style={{ color: "#22c55e", cursor: "pointer" }}>start your 14-day free trial</span>
          </p>

          <form>
            <div style={styles.inputGroup}>
              <span style={{ position: "absolute", left: "12px", top: "38px", color: "#9ca3af" }}>✉️</span>
              <label style={{ fontSize: "0.85rem", color: "#374151", fontWeight: "500" }}>Email address</label>
              <input type="email" style={styles.input} placeholder="Email address" />
            </div>

            <div style={styles.inputGroup}>
              <span style={{ position: "absolute", left: "12px", top: "38px", color: "#9ca3af" }}>🔒</span>
              <label style={{ fontSize: "0.85rem", color: "#374151", fontWeight: "500" }}>Password</label>
              <input type="password" style={styles.input} placeholder="Password" />
              <span style={{ position: "absolute", right: "12px", top: "38px", cursor: "pointer" }}>👁️</span>
            </div>

            <div style={styles.rowBetween}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember" style={{ color: "#4b5563" }}>Remember me</label>
              </div>
              <a href="#" style={{ color: "#22c55e", textDecoration: "none", fontWeight: "500" }}>Forgot your password?</a>
            </div>

            <button type="submit" style={styles.submitButton}>
              <span>🔒</span> Sign in
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;