import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../store/CartContext";
import logoImage from "../assets/logo.png";

const CATS = [
  { label: "Frutas",    to: "/shop?category=Frutas",    icon: "bi-apple"        },
  { label: "Bebidas",   to: "/shop?category=Bebidas",   icon: "bi-cup-straw"    },
  { label: "Lacteos",   to: "/shop?category=Lácteos",   icon: "bi-egg-fried"    },
  { label: "Abarrotes", to: "/shop?category=Abarrotes", icon: "bi-box-seam"     },
  { label: "Snacks",    to: "/shop?category=Snacks",    icon: "bi-cookie"       },
  { label: "Gaseosas",  to: "/shop?category=Gaseosas",  icon: "bi-droplet-half" },
];

const NAV_LINKS = [
  { label: "Inicio",  to: "/",                icon: "bi-house" },
  { label: "Tienda",  to: "/shop",            icon: "bi-shop"  },
  { label: "Ofertas", to: "/shop?tag=Oferta", icon: null, highlight: true },
];

export default function Navbar() {
  const navigate       = useNavigate();
  const location       = useLocation();
  const [searchParams] = useSearchParams();
  const { totalItems } = useCart();
  const inputRef       = useRef(null);

  const [username,    setUsername]    = useState(() => localStorage.getItem("username") || "");
  const [scrolled,    setScrolled]    = useState(false);
  const [catOpen,     setCatOpen]     = useState(false);
  const [searchValue, setSearchValue] = useState(() =>
    location.pathname === "/shop" ? (searchParams.get("search") || "") : ""
  );

  // Limpia búsqueda al salir de /shop
  useEffect(() => {
    if (location.pathname !== "/shop") setSearchValue("");
  }, [location.pathname]);

  // Sincroniza con param externo (ej: usuario vuelve atrás)
  useEffect(() => {
    if (location.pathname === "/shop")
      setSearchValue(searchParams.get("search") || "");
  }, [searchParams, location.pathname]);

  useEffect(() => {
    const sync = () => setUsername(localStorage.getItem("username") || "");
    window.addEventListener("storage",             sync);
    window.addEventListener("localStorageChanged", sync);
    return () => {
      window.removeEventListener("storage",             sync);
      window.removeEventListener("localStorageChanged", sync);
    };
  }, []);

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    setCatOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Filtra en tiempo real y navega a /shop
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    const p = new URLSearchParams(searchParams);
    if (val.trim()) p.set("search", val.trim());
    else p.delete("search");
    navigate(`/shop?${p.toString()}`, { replace: location.pathname === "/shop" });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    const p = new URLSearchParams();
    p.set("search", searchValue.trim());
    navigate(`/shop?${p.toString()}`);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setSearchValue("");
    const p = new URLSearchParams(searchParams);
    p.delete("search");
    navigate(`/shop?${p.toString()}`, { replace: true });
    inputRef.current?.focus();
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("");
    navigate("/");
  };

  return (
    <nav className={`nubix-navbar sticky-top${scrolled ? " scrolled" : ""}`}>

      {/* TOP BAR */}
      <div className="navbar-top">
        <div className="container d-flex align-items-center gap-3 py-2">

          <Link to="/" className="navbar-brand-nubix d-flex align-items-center text-decoration-none flex-shrink-0">
            <span className="brand-logo-wrap">
              <img src={logoImage} alt="Nubix Market" />
            </span>
          </Link>

          {/* Searchbar desktop */}
          <form
            className="search-bar flex-grow-1 d-none d-md-flex position-relative"
            onSubmit={handleSearchSubmit}
          >
            <div className="cat-dropdown-wrap position-relative">
              <button
                type="button"
                className="cat-dropdown-btn"
                onClick={() => setCatOpen(!catOpen)}
              >
                <i className="bi bi-grid me-1"></i>Categorias
                <i className={`bi bi-chevron-${catOpen ? "up" : "down"} ms-1`}></i>
              </button>
              {catOpen && (
                <ul className="cat-dropdown-menu">
                  {CATS.map((c) => (
                    <li key={c.label}>
                      <Link
                        to={c.to}
                        className="cat-dropdown-item"
                        onClick={() => { setCatOpen(false); setSearchValue(""); }}
                      >
                        <i className={`bi ${c.icon} me-2`}></i>{c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <input
              ref={inputRef}
              type="text"
              placeholder="Busca productos, marcas y mas..."
              value={searchValue}
              onChange={handleSearchChange}
              autoComplete="off"
            />

            {searchValue && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={clearSearch}
                aria-label="Limpiar"
              >
                <i className="bi bi-x"></i>
              </button>
            )}

            <button type="submit" aria-label="Buscar">
              <i className="bi bi-search"></i>
            </button>
          </form>

          {/* Acciones */}
          <div className="navbar-actions d-flex align-items-center gap-2 flex-shrink-0">
            {username ? (
              <>
                <div className="nav-action-btn d-none d-md-flex flex-column align-items-center">
                  <i className="bi bi-person-circle fs-5"></i>
                  <span className="nav-action-label">{username}</span>
                </div>
                <button className="nav-action-btn btn p-0 border-0" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right fs-5"></i>
                  <span className="nav-action-label d-none d-md-block">Salir</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-action-btn text-decoration-none">
                <i className="bi bi-person fs-5"></i>
                <span className="nav-action-label d-none d-md-block">Ingresar</span>
              </Link>
            )}
            <Link to="/cart" className="nav-action-btn cart-btn text-decoration-none position-relative">
              <i className="bi bi-cart3 fs-5"></i>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              <span className="nav-action-label d-none d-md-block">Mi carrito</span>
            </Link>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="navbar-bottom d-none d-lg-block">
        <div className="container">
          <ul className="nav-cats d-flex align-items-center gap-1 m-0 p-0 list-unstyled">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className={`nav-cat-link${item.highlight ? " nav-cat-highlight" : ""}`}
                >
                  {item.icon && <i className={`bi ${item.icon} me-1`}></i>}{item.label}
                </Link>
              </li>
            ))}
            {CATS.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="nav-cat-link">
                  <i className={`bi ${item.icon} me-1`}></i>{item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SEARCHBAR MOBILE */}
      <div className="d-md-none px-3 pb-2">
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchValue}
            onChange={handleSearchChange}
            autoComplete="off"
          />
          {searchValue && (
            <button type="button" className="search-clear-btn" onClick={clearSearch}>
              <i className="bi bi-x"></i>
            </button>
          )}
          <button type="submit" aria-label="Buscar">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>

    </nav>
  );
}