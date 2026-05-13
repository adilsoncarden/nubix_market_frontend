import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../store/CartContext";
import logoImage from "../assets/logo.png";
import { CATEGORIAS_DATA } from "./MainContent"; // Importamos la fuente de verdad

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { totalItems } = useCart();
  const dropdownRef = useRef(null);

  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Sincronizar input de búsqueda con la URL
  useEffect(() => {
    const query = searchParams.get("search") || "";
    if (location.pathname === "/shop") setSearchValue(query);
    else setSearchValue("");
  }, [location.pathname, searchParams]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) navigate(`/shop?search=${searchValue.trim()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername("");
    navigate("/");
  };

  // Construcción de links unificada
  const mainLinks = [
    { label: "Inicio", to: "/", icon: "bi-house" },
    { label: "Tienda", to: "/shop", icon: "bi-shop" },
    { label: "Ofertas", to: "/shop?tag=Oferta", icon: "bi-lightning-charge", highlight: true },
  ];

  return (
    <nav className={`nubix-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container-fluid py-2 border-bottom bg-white">
        <div className="container d-flex align-items-center justify-content-between">
          
          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="d-flex align-items-center text-decoration-none">
              <div className="brand-logo-wrap">
                <img src={logoImage} alt="Logo" style={{ maxHeight: '50px' }} />
              </div>
            </Link>

            <div className="cat-dropdown-wrap" ref={dropdownRef}>
              <button 
                className="cat-dropdown-btn" 
                onClick={() => setCatOpen(!catOpen)}
                style={{ background: 'orange', color: 'white', borderRadius: '10px', height: '44px', border: 'none', padding: '0 15px' }}
              >
                <i className="bi bi-list fs-5"></i>
                <span className="ms-1 d-none d-md-inline">Categorías</span>
                <i className={`bi bi-chevron-${catOpen ? 'up' : 'down'} ms-1`} style={{ fontSize: '.7rem' }}></i>
              </button>

              {catOpen && (
                <ul className="cat-dropdown-menu show shadow-lg" style={{ listStyle: 'none', padding: '10px', minWidth: '200px' }}>
                  {/* Links Principales */}
                  {mainLinks.map((link, idx) => (
                    <li key={`main-${idx}`}>
                      <Link to={link.to} className={`cat-dropdown-item ${link.highlight ? 'text-danger fw-bold' : ''}`} onClick={() => setCatOpen(false)} style={{ display: 'block', padding: '8px', textDecoration: 'none', color: '#333', borderBottom: '1px solid #eee' }}>
                        <i className={`bi ${link.icon} me-2 text-success`}></i>{link.label}
                      </Link>
                    </li>
                  ))}
                  {/* Categorías Dinámicas */}
                  {CATEGORIAS_DATA.map((cat, idx) => (
                    <li key={`cat-${idx}`}>
                      <Link to={`/shop?category=${cat.nombre}`} className="cat-dropdown-item" onClick={() => setCatOpen(false)} style={{ display: 'block', padding: '8px', textDecoration: 'none', color: '#333' }}>
                        <i className={`bi ${cat.icono} me-2 text-muted`}></i>{cat.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <form className="search-bar flex-grow-1 mx-3 mx-lg-5" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Busca productos..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="form-control"
            />
          </form>

          <div className="navbar-actions d-flex align-items-center gap-3">
            {username ? (
              <div className="dropdown">
                <button className="nav-action-btn border-0 dropdown-toggle" data-bs-toggle="dropdown" style={{ background: 'none' }}>
                  <i className="bi bi-person-circle fs-4"></i>
                  <span className="nav-action-label ms-1">{username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar Sesión</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="nav-action-btn text-decoration-none color-dark">
                <i className="bi bi-person fs-4"></i>
                <span className="nav-action-label d-none d-md-inline">Ingresar</span>
              </Link>
            )}

            <Link to="/cart" className="nav-action-btn cart-btn text-decoration-none position-relative">
              <i className="bi bi-cart3 fs-4"></i>
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}