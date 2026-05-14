import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../store/CartContext";
import logoImage from "../assets/logo.png";
import { CATEGORIAS_DATA } from "./MainContent"; 

export default function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null); // Ref para el menú de usuario

  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // Estado para el menú de Pedro
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    // Cerrar menús si se hace clic fuera
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCatOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) navigate(`/shop?search=${searchValue.trim()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUsername("");
    setUserMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  const getMejorIcono = (nombre, iconoOriginal) => {
    if (iconoOriginal && iconoOriginal.startsWith('bi-')) return iconoOriginal;
    const n = nombre.toLowerCase();
    if (n.includes("gaseosa") || n.includes("bebida")) return "bi-cup-straw";
    if (n.includes("fruta") || n.includes("verdura")) return "bi-apple";
    if (n.includes("lácteo") || n.includes("leche")) return "bi-droplet";
    if (n.includes("snack") || n.includes("piqueo")) return "bi-egg-fried";
    if (n.includes("abarrote")) return "bi-box-seam";
    if (n.includes("limpieza")) return "bi-stars";
    if (n.includes("cuidado")) return "bi-heart-pulse";
    return "bi-tag";
  };

  const navItemStyle = {
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
    color: '#1a1a1a',
    textDecoration: 'none'
  };

  return (
    <>
      <nav className={`fixed-top w-100 bg-white ${scrolled ? "shadow-sm" : "border-bottom"}`} style={{ transition: '0.3s ease', zIndex: 1100 }}>
        <div className="container"> 
          <div className="d-flex align-items-center justify-content-between py-3">
            
            {/* 1. LOGO */}
            <div className="me-4">
              <Link to="/">
                <img src={logoImage} alt="Logo" style={{ height: '38px', width: 'auto' }} />
              </Link>
            </div>

            {/* 2. CATEGORÍAS */}
            <div className="d-none d-lg-flex align-items-center gap-4" ref={dropdownRef}>
              <div className="position-relative">
                <span 
                  className="d-flex align-items-center gap-1 cursor-pointer" 
                  style={{ ...navItemStyle, cursor: 'pointer' }}
                  onClick={() => setCatOpen(!catOpen)}
                >
                  CATEGORÍAS <i className={`bi bi-chevron-${catOpen ? 'up' : 'down'}`} style={{ fontSize: '0.6rem' }}></i>
                </span>
                
                {catOpen && (
                  <div className="position-absolute top-100 start-0 bg-white shadow-lg rounded-3 py-2 mt-3 border-0" 
                       style={{ zIndex: 1200, minWidth: '220px' }}>
                    {CATEGORIAS_DATA.map((cat, idx) => (
                      <Link 
                        key={idx} 
                        to={`/shop?category=${cat.nombre}`} 
                        className="dropdown-item py-2 px-3 d-flex align-items-center rounded-2 mx-2"
                        style={{ width: 'auto', fontSize: '0.85rem' }}
                        onClick={() => setCatOpen(false)}
                      >
                        <i className={`bi ${getMejorIcono(cat.nombre, cat.icono)} me-3`} style={{ fontSize: '1.2rem', color: '#198754', minWidth: '25px' }}></i> 
                        <span style={{ fontWeight: '500' }}>{cat.nombre}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. BUSCADOR */}
            <div className="flex-grow-1 mx-4 d-none d-md-block" style={{ maxWidth: '380px' }}>
              <form className="position-relative" onSubmit={handleSearch}>
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ fontSize: '0.8rem' }}></i>
                <input
                  type="text"
                  className="form-control border-0 rounded-pill ps-5"
                  placeholder="¿Qué estás buscando hoy?"
                  style={{ backgroundColor: '#f1f3f5', fontSize: '0.85rem', height: '40px' }}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </form>
            </div>

            {/* 4. ACCIONES (ARREGLADO AQUÍ) */}
            <div className="d-flex align-items-center gap-4">
              {username ? (
                <div className="position-relative" ref={userMenuRef}>
                  <button 
                    className="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center gap-2 border-0" 
                    onClick={() => setUserMenuOpen(!userMenuOpen)} // Control manual del clic
                  >
                    <i className="bi bi-person fs-4"></i>
                    <div className="text-start d-none d-xl-block" style={{ lineHeight: '1.1' }}>
                      <div className="text-muted" style={{ fontSize: '0.65rem' }}>HOLA,</div>
                      <div className="fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                        {username.toUpperCase()} <i className={`bi bi-chevron-${userMenuOpen ? 'up' : 'down'}`} style={{ fontSize: '0.6rem' }}></i>
                      </div>
                    </div>
                  </button>

                  {/* Menú desplegable manual */}
                  {userMenuOpen && (
                    <div className="position-absolute end-0 bg-white shadow-lg border-0 mt-3 p-2 rounded-3" 
                         style={{ zIndex: 1200, minWidth: '180px', top: '100%' }}>
                      {localStorage.getItem("role") === "ADMIN" && (
                        <Link 
                          className="dropdown-item rounded-2 py-2 fw-bold text-primary" 
                          to="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Panel Admin
                        </Link>
                      )}
                      <button 
                        className="dropdown-item rounded-2 py-2 text-danger" 
                        onClick={handleLogout}
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-dark text-decoration-none d-flex align-items-center gap-2">
                  <i className="bi bi-person fs-4"></i>
                  <div className="text-start d-none d-xl-block" style={{ lineHeight: '1.1' }}>
                    <div className="text-muted" style={{ fontSize: '0.65rem' }}>HOLA,</div>
                    <div className="fw-bold" style={{ fontSize: '0.75rem' }}>INICIAR SESIÓN</div>
                  </div>
                </Link>
              )}

              <Link to="/cart" className="text-dark text-decoration-none d-flex align-items-center gap-2 position-relative">
                <i className="bi bi-cart3 fs-4"></i>
                {totalItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-success" 
                        style={{ fontSize: '0.6rem', padding: '0.35em 0.5em', marginTop: '2px' }}>
                    {totalItems}
                  </span>
                )}
                <span className="d-none d-xl-inline fw-bold" style={{ fontSize: '0.75rem' }}>CARRITO</span>
              </Link>
            </div>

          </div>
        </div>
      </nav>

      <div style={{ marginTop: scrolled ? '75px' : '82px' }}></div>
    </>
  );
}