import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../store/CartContext";
import logoImage from "../assets/logo.png";

const ALL_LINKS = [
  { label: "Inicio", to: "/", icon: "bi-house", isMain: true },
  { label: "Tienda", to: "/shop", icon: "bi-shop", isMain: true },
  { label: "Ofertas", to: "/shop?tag=Oferta", icon: "bi-lightning-charge", highlight: true, isMain: true },
  { label: "Frutas", to: "/shop?category=Frutas", icon: "bi-apple" },
  { label: "Bebidas", to: "/shop?category=Bebidas", icon: "bi-cup-straw" },
  { label: "Lacteos", to: "/shop?category=Lácteos", icon: "bi-egg-fried" },
  { label: "Abarrotes", to: "/shop?category=Abarrotes", icon: "bi-box-seam" },
  { label: "Snacks", to: "/shop?category=Snacks", icon: "bi-cookie" },
  { label: "Gaseosas", to: "/shop?category=Gaseosas", icon: "bi-droplet-half" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { totalItems } = useCart();
  const dropdownRef = useRef(null);

  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(() =>
    location.pathname === "/shop" ? (searchParams.get("search") || "") : ""
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCatOpen(false);
      }
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

  return (
    <nav className={`nubix-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container-fluid py-2 border-bottom bg-white">
        <div className="container d-flex align-items-center justify-content-between">
          
          {/* LADO IZQUIERDO: SOLO LOGO Y BOTÓN CATEGORÍAS */}
          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="d-flex align-items-center text-decoration-none">
              <div className="brand-logo-wrap">
                <img src={logoImage} alt="Logo" style={{ maxHeight: '50px' }} />
              </div>
              {/* Se eliminó el div de brand-name */}
            </Link>

            {/* BOTÓN CATEGORÍAS NARANJA */}
            <div className="cat-dropdown-wrap" ref={dropdownRef}>
              <button 
                className="cat-dropdown-btn" 
                onClick={() => setCatOpen(!catOpen)}
                style={{ background: 'var(--accent)', borderRadius: '10px', height: '44px', border: 'none' }}
              >
                <i className="bi bi-list fs-5"></i>
                <span className="ms-1 d-none d-md-inline">Categorías</span>
                <i className={`bi bi-chevron-${catOpen ? 'up' : 'down'} ms-1`} style={{ fontSize: '.7rem' }}></i>
              </button>

              {catOpen && (
                <ul className="cat-dropdown-menu show shadow-lg">
                  {ALL_LINKS.map((link, idx) => (
                    <li key={idx}>
                      <Link 
                        to={link.to} 
                        className={`cat-dropdown-item ${link.highlight ? 'nav-cat-highlight' : ''}`}
                        onClick={() => setCatOpen(false)}
                        style={link.isMain ? { borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '5px' } : {}}
                      >
                        {link.icon && <i className={`bi ${link.icon} me-2 text-success`}></i>}
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* CENTRO: BARRA DE BÚSQUEDA */}
          <form className="search-bar flex-grow-1 mx-3 mx-lg-5" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Busca productos, marcas y más..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          {/* LADO DERECHO: ACCIONES ORIGINALES RECUPERADAS */}
          <div className="navbar-actions d-flex align-items-center gap-3">
            {username ? (
              <div className="dropdown">
                <button className="nav-action-btn border-0 dropdown-toggle" data-bs-toggle="dropdown" style={{ background: 'none' }}>
                  <i className="bi bi-person-circle fs-4"></i>
                  <span className="nav-action-label">{username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar Sesión</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="nav-action-btn text-decoration-none">
                <i className="bi bi-person fs-4"></i>
                <span className="nav-action-label">Ingresar</span>
              </Link>
            )}

            <Link to="/cart" className="nav-action-btn cart-btn text-decoration-none">
              <i className="bi bi-cart3 fs-4"></i>
              <span className="nav-action-label">Carrito</span>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}