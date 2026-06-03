import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/CartContext";
import { useFavorites } from "../store/FavoritesContext";
import { useAuth } from "../store/AuthContext";
import { clearRedirectUrl, setRedirectUrl } from "../utils/authUtils";
import api from "../config/axios";
import logoImage from "../assets/logo.png";
import { useShopProducts } from "../features/products/hooks/useShopProducts";
import "../styles/landing.css";

function productFormatLabel(product) {
    if (product.unit === "kg") return "FRASCO";
    if (product.tag) return "SUPER PACK";
    return "CAJA 30 UN";
}

export default function Navbar() {
    const navigate = useNavigate();
    const { totalItems, cartAnimationTick, addToCart } = useCart();
    const [cartIconAnimating, setCartIconAnimating] = useState(false);
    const { count: favoritesCount, toggleFavorite, isFavorite } = useFavorites();
    const { webToken, webUser, logoutWeb, canAccessAdmin } = useAuth();
    const token = webToken;
    const user = webUser;

    const userMenuRef = useRef(null);
    const notifRef = useRef(null);
    const searchWrapRef = useRef(null);

    const { products, loading: catalogLoading } = useShopProducts();
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const searchPanelOpen = searchFocused || searchValue.trim().length > 0;
    const searchQuery = searchValue.trim().toLowerCase();

    const suggestedProducts = useMemo(() => {
        let list = products;
        if (searchQuery) {
            list = list.filter((p) =>
                String(p.name || "")
                    .toLowerCase()
                    .includes(searchQuery),
            );
        }
        return list.slice(0, 8);
    }, [products, searchQuery]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target))
                setUserMenuOpen(false);
            if (searchWrapRef.current && !searchWrapRef.current.contains(e.target))
                setSearchFocused(false);
            if (notifRef.current && !notifRef.current.contains(e.target))
                setNotifOpen(false);
        };
        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!token) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        let mounted = true;
        const loadNotifications = async () => {
            try {
                const [listRes, countRes] = await Promise.all([
                    api.get("/notificaciones"),
                    api.get("/notificaciones/count-no-leidas"),
                ]);
                if (!mounted) return;
                setNotifications(Array.isArray(listRes.data) ? listRes.data : []);
                setUnreadCount(Number(countRes.data || 0));
            } catch {
                // no-op
            }
        };

        loadNotifications();
        const interval = setInterval(loadNotifications, 15000);
        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [token]);

    const marcarLeida = async (id) => {
        try {
            await api.put(`/notificaciones/${id}/leer`);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, leido: true } : n)),
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch {
            // no-op
        }
    };

    const handleLogout = () => {
        clearRedirectUrl();
        logoutWeb();
        setUserMenuOpen(false);
        navigate("/");
    };

    useEffect(() => {
        if (!searchPanelOpen) {
            setSearchLoading(false);
            return;
        }
        setSearchLoading(true);
        const timer = setTimeout(() => setSearchLoading(false), 320);
        return () => clearTimeout(timer);
    }, [searchValue, searchPanelOpen, catalogLoading]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const q = searchValue.trim();
        setSearchFocused(false);
        navigate(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
    };

    const closeSearchPanel = () => {
        setSearchFocused(false);
        setSearchValue("");
    };

    useEffect(() => {
        if (!searchPanelOpen) return;
        const onEscape = (e) => {
            if (e.key === "Escape") closeSearchPanel();
        };
        window.addEventListener("keydown", onEscape);
        return () => window.removeEventListener("keydown", onEscape);
    }, [searchPanelOpen]);

    const clearSearchText = () => {
        setSearchValue("");
    };

    useEffect(() => {
        if (searchPanelOpen) {
            document.body.classList.add("search-overlay-active");
        } else {
            document.body.classList.remove("search-overlay-active");
        }
        return () => document.body.classList.remove("search-overlay-active");
    }, [searchPanelOpen]);

    useEffect(() => {
        if (cartAnimationTick === 0) return;
        setCartIconAnimating(true);
        const timer = setTimeout(() => setCartIconAnimating(false), 320);
        return () => clearTimeout(timer);
    }, [cartAnimationTick]);

    const handleSuggestedAdd = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        await addToCart({
            id: product.id,
            name: product.name,
            category: product.category,
            priceBase: product.priceBase,
            price: product.price,
            stock: product.stock,
            unit: product.unit || "und",
            img: product.img,
        });
    };

    const handleSuggestedFavorite = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) {
            setRedirectUrl(window.location.pathname);
            navigate("/login");
            return;
        }
        await toggleFavorite(product.id, {
            id: product.id,
            name: product.name,
            category: product.category,
            priceBase: product.priceBase,
            price: product.price,
            stock: product.stock,
            unit: product.unit || "und",
            img: product.img,
        });
    };

    const showAllHref = searchValue.trim()
        ? `/shop?search=${encodeURIComponent(searchValue.trim())}`
        : "/shop";

    return (
        <>
            <style>{`
        :root { --nubix-green: #134d27; --text-dark: #1e293b; }
        .navbar-nubix { background-color: #ffffff !important; transition: all 0.3s ease; }
        .action-icon-btn { color: var(--text-dark); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 12px; cursor: pointer; }
        .action-icon-btn:hover { background-color: #f1f5f9; color: var(--nubix-green); }
        .dropdown-menu-wow { border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 16px; padding: 8px; }
        .btn-logout-mini { display: flex; align-items: center; gap: 8px; color: #dc3545; background: #fff5f5; border-radius: 8px; padding: 6px 12px; font-size: 0.75rem; font-weight: 600; border: none; transition: all 0.2s; }
        .btn-logout-mini:hover { background: #fee2e2; }
        .notif-dropdown { width: 320px; max-height: 380px; overflow-y: auto; }
        .notif-item { border-bottom: 1px solid #f1f5f9; padding: 10px 8px; }
        .notif-item:last-child { border-bottom: none; }
        .notif-unread-dot { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; display: inline-block; }
      `}</style>

            {searchPanelOpen && (
                <div
                    className="overlay-backdrop"
                    onClick={closeSearchPanel}
                    role="presentation"
                    aria-hidden="true"
                />
            )}

            <nav
                className={`fixed-top w-100 navbar-nubix navbar-landing${searchPanelOpen ? " navbar-search-active" : ""} ${scrolled ? "scrolled" : ""}`}
            >
                <div className="container py-2">
                    <div
                        className={`d-flex align-items-center gap-2 gap-lg-3 navbar-inner-row${searchPanelOpen ? " navbar-inner-row--mega" : ""}`}
                    >
                        <Link
                            to="/"
                            className={`d-flex align-items-center text-decoration-none flex-shrink-0 navbar-brand-slot${searchPanelOpen ? " navbar-brand-slot--dimmed" : ""}`}
                        >
                            <img src={logoImage} alt="Nubix Market" className="navbar-logo-only" />
                        </Link>

                        <nav
                            className={`landing-nav-links d-none d-xl-flex${searchPanelOpen ? " landing-nav-links--hidden" : ""}`}
                        >
                            <Link to="/" className="landing-nav-link">Inicio</Link>
                            <Link to="/shop" className="landing-nav-link">Tienda</Link>
                            <Link to="/shop" className="landing-nav-link">Ofertas</Link>
                            <Link to="/shop" className="landing-nav-link">Categorías</Link>
                        </nav>

                        {searchPanelOpen && (
                            <div
                                className="navbar-search-spacer flex-grow-1 d-none d-md-block"
                                aria-hidden="true"
                            />
                        )}

                        <form
                            className={`nubix-nav-search${searchPanelOpen ? " is-active is-mega" : " navbar-search-collapsed flex-grow-1"}`}
                            onSubmit={handleSearchSubmit}
                            ref={searchWrapRef}
                        >
                            <div
                                className={`search-input-row${searchPanelOpen ? " is-open is-expanded" : ""}`}
                            >
                                <input
                                    type="text"
                                    className="form-control landing-search-input landing-search-input--wide"
                                    placeholder="¿Qué buscas hoy?"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    autoComplete="off"
                                    title="Buscar productos en Nubix Market"
                                />
                                {searchValue.trim().length > 0 && (
                                    <button
                                        type="button"
                                        className="search-clear-inline"
                                        onClick={clearSearchText}
                                        aria-label="Borrar búsqueda"
                                        title="Borrar texto"
                                    >
                                        <i className="bi bi-x-lg" />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="btn-search-submit-round"
                                    aria-label="Buscar"
                                    title="Buscar"
                                >
                                    <i className="bi bi-search" />
                                </button>
                            </div>

                            {searchPanelOpen && (
                                <div className="search-dropdown" role="dialog" aria-label="Productos sugeridos">
                                    <p className="search-suggestions-title">Productos sugeridos</p>
                                    <div className="search-dropdown-body">
                                        {catalogLoading || searchLoading ? (
                                            <div className="search-dropdown-loading">
                                                <div
                                                    className="spinner-border text-success search-dropdown-spinner"
                                                    role="status"
                                                />
                                                <div className="search-skeleton-list" aria-hidden="true">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="search-skeleton-row">
                                                            <div className="search-skeleton-img" />
                                                            <div className="search-skeleton-lines">
                                                                <div className="search-skeleton-line short" />
                                                                <div className="search-skeleton-line" />
                                                                <div className="search-skeleton-line medium" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : searchQuery && suggestedProducts.length === 0 ? (
                                            <p className="search-suggestions-empty">
                                                No se encontraron productos para tu búsqueda
                                            </p>
                                        ) : suggestedProducts.length === 0 ? (
                                            <p className="search-suggestions-empty">
                                                No hay productos disponibles en el catálogo
                                            </p>
                                        ) : (
                                            suggestedProducts.map((p) => {
                                                const oldP = (Number(p.price) * 1.2).toFixed(2);
                                                const cardP = (Number(p.price) * 0.94).toFixed(2);
                                                const favorited = isFavorite(p.id);
                                                return (
                                                    <div
                                                        key={p.id}
                                                        className="search-suggestion-row d-flex align-items-center justify-content-between py-3 px-4 border-bottom w-100"
                                                    >
                                                        <Link
                                                            to={`/producto/${p.id}`}
                                                            className="search-suggestion-link search-suggestion-main d-flex align-items-center flex-grow-1 me-3"
                                                            onClick={() => setSearchFocused(false)}
                                                        >
                                                            <img
                                                                src={p.img}
                                                                alt=""
                                                                className="search-suggestion-img flex-shrink-0 me-3"
                                                            />
                                                            <div className="search-suggestion-info text-start">
                                                                <span className="search-suggestion-format">
                                                                    {productFormatLabel(p)}
                                                                </span>
                                                                <span className="search-suggestion-name">
                                                                    {p.name}
                                                                </span>
                                                                <span className="search-suggestion-badge">
                                                                    Te puede interesar
                                                                </span>
                                                                <span className="search-suggestion-provider">
                                                                    {p.category || "Nubix Market"}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                        <div className="search-suggestion-prices-col flex-shrink-0 text-end">
                                                            <span className="old d-block">S/ {oldP}</span>
                                                            <span className="normal d-block">
                                                                S/ {Number(p.price).toFixed(2)}
                                                            </span>
                                                            <span className="card d-block">S/ {cardP}</span>
                                                        </div>
                                                        <div className="search-suggestion-actions flex-shrink-0 d-flex align-items-center">
                                                            <button
                                                                type="button"
                                                                className="btn-search-add-oval"
                                                                onClick={(e) => handleSuggestedAdd(e, p)}
                                                                title="Agregar al carrito"
                                                            >
                                                                Agregar al carrito
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className={`btn-search-fav${favorited ? " active" : ""}`}
                                                                onClick={(e) =>
                                                                    handleSuggestedFavorite(e, p)
                                                                }
                                                                aria-label="Favoritos"
                                                                title={
                                                                    favorited
                                                                        ? "Quitar de favoritos"
                                                                        : "Agregar a favoritos"
                                                                }
                                                            >
                                                                <i
                                                                    className={`bi ${favorited ? "bi-heart-fill" : "bi-heart"}`}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                    <div className="search-dropdown-footer">
                                        <Link
                                            to={showAllHref}
                                            className="search-show-all-link"
                                            onClick={() => setSearchFocused(false)}
                                        >
                                            Mostrar todos los resultados
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </form>

                        <div
                            className={`d-flex align-items-center gap-1 flex-shrink-0 navbar-actions-slot${searchPanelOpen ? " navbar-actions-slot--dimmed" : ""}`}
                        >
                            <button
                                type="button"
                                className="landing-icon-btn"
                                aria-label="Ingresa tu ubicación"
                                onClick={() =>
                                    document.querySelector(".bar-ubicacion-trigger")?.click()
                                }
                            >
                                <i className="bi bi-geo-alt" />
                            </button>
                            {token ? (
                                <div className="position-relative" ref={userMenuRef}>
                                    <button
                                        type="button"
                                        className="btn d-flex align-items-center gap-2 border-0"
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    >
                                        <div className="landing-icon-btn">
                                            <i className="bi bi-person" />
                                        </div>
                                        <div className="text-start d-none d-sm-block" style={{ lineHeight: "1.1" }}>
                                            <div style={{ fontSize: "0.6rem", color: "#64748b" }}>HOLA,</div>
                                            <div className="fw-bold" style={{ fontSize: "0.78rem", color: "black" }}>
                                                {user?.username?.toUpperCase() || "USUARIO"}
                                            </div>
                                        </div>
                                    </button>
                                    {userMenuOpen && (
                                        <div
                                            className="position-absolute end-0 dropdown-menu-wow bg-white mt-2 p-2"
                                            style={{ minWidth: "150px" }}
                                        >
                                            {canAccessAdmin && (
                                                <Link className="dropdown-item mb-2" to="/admin/dashboard">
                                                    Panel Admin
                                                </Link>
                                            )}
                                            <button type="button" className="btn-logout-mini w-100" onClick={handleLogout}>
                                                <i className="bi bi-box-arrow-left" />
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="text-decoration-none d-flex align-items-center gap-2">
                                    <div className="landing-icon-btn">
                                        <i className="bi bi-person" />
                                    </div>
                                    <div className="fw-bold d-none d-sm-block" style={{ fontSize: "0.78rem", color: "black" }}>
                                        INICIAR SESIÓN
                                    </div>
                                </Link>
                            )}

                            <Link
                                to={token ? "/favorites" : "/login"}
                                className="landing-icon-btn text-decoration-none position-relative"
                            >
                                <i className="bi bi-heart" />
                                {token && favoritesCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle landing-cart-badge">
                                        {favoritesCount > 9 ? "9+" : favoritesCount}
                                    </span>
                                )}
                            </Link>
                            {token && (
                                <div className="position-relative" ref={notifRef}>
                                    <button
                                        type="button"
                                        className="landing-icon-btn border-0 bg-transparent position-relative"
                                        onClick={() => setNotifOpen((v) => !v)}
                                        aria-label="Notificaciones"
                                    >
                                        <i className="bi bi-bell" />
                                        {unreadCount > 0 && (
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger">
                                                {unreadCount > 9 ? "9+" : unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    {notifOpen && (
                                        <div className="position-absolute end-0 dropdown-menu-wow bg-white mt-2 notif-dropdown">
                                            <div className="d-flex justify-content-between align-items-center px-2 pb-2">
                                                <strong style={{ fontSize: "0.85rem" }}>Notificaciones</strong>
                                                <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                                                    {notifications.length} recientes
                                                </span>
                                            </div>
                                            {notifications.length === 0 ? (
                                                <div className="text-muted px-2 py-2" style={{ fontSize: "0.8rem" }}>
                                                    No tienes notificaciones.
                                                </div>
                                            ) : (
                                                notifications.map((n) => (
                                                    <div key={n.id} className="notif-item">
                                                        <div className="d-flex align-items-start justify-content-between gap-2">
                                                            <div style={{ fontSize: "0.8rem", color: "#0f172a" }}>
                                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                                    {!n.leido && <span className="notif-unread-dot" />}
                                                                    <strong className="text-capitalize">{n.tipo}</strong>
                                                                </div>
                                                                <div>{n.mensaje}</div>
                                                                <small className="text-muted">
                                                                    {new Date(n.fecha).toLocaleString("es-PE")}
                                                                </small>
                                                            </div>
                                                            {!n.leido && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-success"
                                                                    onClick={() => marcarLeida(n.id)}
                                                                >
                                                                    Leer
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            <Link
                                to={token ? "/cart" : "/login"}
                                className={`landing-icon-btn text-decoration-none position-relative${cartIconAnimating ? " animate-bounce-cart" : ""}`}
                            >
                                <i className="bi bi-cart3" />
                                {token && totalItems > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle landing-cart-badge">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <div style={{ marginTop: "75px" }} />
        </>
    );
}
