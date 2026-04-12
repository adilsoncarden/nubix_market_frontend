return (
    <div style={styles.loginPage}>
      
      {/* SECCIÓN 1: NAVBAR (Buscador incluido) */}
      <nav style={styles.navbar}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "50%", padding: "5px", display: "flex" }}>
               <img src={logoImage} alt="Logo" style={{ height: "20px" }} />
            </div>
            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>SuperMarket</span>
          </div>

          <div style={styles.searchContainer}>
            <span style={{ position: "absolute", left: "10px", color: "white" }}>🔍</span>
            <input type="text" placeholder="Search for products..." style={styles.searchInput} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
          <span>Home</span>
          <span>Shop</span>
          <span>👤 Login</span>
          <span style={{ fontSize: "1.3rem" }}>🛒</span>
        </div>
      </nav>

      {/* SECCIÓN 2: TARJETA DE LOGIN */}
      <main style={styles.mainContent}>
        <div style={styles.card}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔓</div>
          <h2 style={{ fontSize: "1.7rem", marginBottom: "10px" }}>Sign in to your account</h2>
          <p style={{ color: "#6b7280", marginBottom: "30px" }}>
            Or <span style={{ color: "#22c55e", fontWeight: "600" }}>start your 14-day free trial</span>
          </p>

          <form>
            <div style={styles.inputGroup}>
              <span style={{ position: "absolute", left: "12px", top: "14px" }}>✉️</span>
              <input type="email" style={styles.input} placeholder="Email address" />
            </div>

            <div style={styles.inputGroup}>
              <span style={{ position: "absolute", left: "12px", top: "14px" }}>🔒</span>
              <input type="password" style={styles.input} placeholder="Password" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "20px" }}>
              <label><input type="checkbox" /> Remember me</label>
              <a href="#" style={{ color: "#22c55e", textDecoration: "none" }}>Forgot your password?</a>
            </div>

            <button type="submit" style={styles.submitButton}>Sign in</button>
          </form>
        </div>
      </main>

    </div>
  );