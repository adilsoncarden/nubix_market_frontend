// src/pages/Login.jsx
import React from "react";
// Importamos las imágenes que guardaste en assets
import logoImage from "../assets/logo.png";
import supermarketImage from "../assets/supermarket.jpg";

function Login() {
  const styles = {
    loginPage: {
      display: "flex",
      minHeight: "100vh",
      width: "100%",
    },
    formColumn: {
      flex: 1,
      padding: "40px 60px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    formContent: {
      maxWidth: "500px",
      width: "100%",
    },
    imageColumn: {
      flex: 1,
      backgroundImage: `url(${supermarketImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "none", 
    },
    logoContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start", 
      marginBottom: "70px",
      width: "600%", 
    },
    logoImage: {
      height: "120px",
      marginBottom: "100px",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "1000",
      marginBottom: "10px",
    },
    subtitle: {
      fontSize: "1rem",
      color: "var(--text-sub)",
      marginBottom: "30px",
    },
    inputGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontWeight: "600",
      marginBottom: "5px",
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      border: `1px solid var(--border-color)`,
      borderRadius: "8px",
      fontSize: "1rem",
    },
    rowBetween: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    rememberContainer: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
      fontSize: "0.9rem",
    },
    forgotPassword: {
      fontSize: "0.9rem",
      color: "var(--text-sub)",
      textDecoration: "none",
    },
    submitButton: {
      width: "100%",           
      padding: "12px",        
      backgroundColor: "#3f6027", 
      color: "white",       
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "20px",       
      display: "block",     
    },
    socialButtons: {
      display: "flex",
      gap: "15px",
      marginBottom: "30px",
    },
    socialButton: {
      flex: 1,
      padding: "10px",
      border: `1px solid var(--border-color)`,
      borderRadius: "8px",
      backgroundColor: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
    },
    registerPrompt: {
      textAlign: "center",
      fontSize: "1rem",
    },
    registerLink: {
      color: "var(--primary-color)",
      fontWeight: "600",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.loginPage}>
      {/* Columna del Formulario */}
      <div style={styles.formColumn}>
        <div style={styles.formContent}>
          
          {/* Logo */}
          <div style={styles.logoContainer}>
            <img src={logoImage} alt="NUBIX MARKET" style={styles.logoImage} />
            <h1 style={{fontSize: '1.2rem', margin: '0', color: 'var(--primary-color)'}}>NUBIX MARKET</h1>
          </div>

          {/* Título */}
          <h2 style={styles.title}>Iniciar Sesión</h2>
          <p style={styles.subtitle}>Ingrese sus credenciales, para navegar por la bodega.</p>
          
          <form>
            {/* Correo */}
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Correo :</label>
              <input type="email" id="email" style={styles.input} placeholder="Escribe tu correo" />
            </div>

            {/* Contraseña y Olvidaste tu contraseña */}
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Contraseña :</label>
              <input type="password" id="password" style={styles.input} placeholder="Escribe tu contraseña" />
            </div>

            {/* Recordar por 30 días y Olvidaste */}
            <div style={styles.rowBetween}>
                <div style={styles.rememberContainer}>
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Recordar por 30 días</label>
                </div>
                <a href="#" style={styles.forgotPassword}>¿Olvidaste tu contraseña?</a>
            </div>

            {/* Botón Ingresar */}
            <button type="submit" style={styles.submitButton}>Ingresar</button>
          </form>

          {/* Botones Sociales */}
          <div style={styles.socialButtons}>
            <button style={styles.socialButton}>
                {/* Puedes usar iconos de react-icons aquí más adelante */}
                <span>Icon Google</span> Sign in with Google
            </button>
            <button style={styles.socialButton}>
                <span>Icon Apple</span> Sign in with Apple
            </button>
          </div>

          {/* Registro */}
          <p style={styles.registerPrompt}>
            No tienes cuenta? <a href="#" style={styles.registerLink}>Registrarme</a>
          </p>
        </div>
      </div>

      {/* Columna de la Imagen (visible en pantallas grandes) */}
      <div style={{...styles.imageColumn, display: 'block'}}></div>
    </div>
  );
}

export default Login;