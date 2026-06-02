import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/CartContext";
import { useAuth } from "../store/AuthContext";
import { clearRedirectUrl } from "../utils/authUtils";
import api from "../config/axios";
import logoImage from "../assets/logo.png";
import { CATEGORIAS_DATA } from "./MainContent";

export default function Navbar() {
    const navigate = useNavigate();
    const { totalItems } = useCart();
    const { token, user, logout } = useAuth();

    const dropdownRef = useRef(null);
    const userMenuRef = useRef(null);
    const notifRef = useRef(null);

    const [scrolled, setScrolled] = useState(false);
    const [catOpen, setCatOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target))
                setUserMenuOpen(false);
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setCatOpen(false);
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
            } catch (e) {
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
        } catch (e) {
            // no-op
        }
    };

    const handleLogout = () => {
        clearRedirectUrl();
        logout();
        setUserMenuOpen(false);
        navigate("/");
    };

    const iconMap = {
        Gaseosas: "bi-cup-straw",
        Frutas: "bi-apple",
        Lácteos: "bi-droplet-half",
        Snacks: "bi-bag-heart",
        Abarrotes: "bi-box-seam",
        Bebidas: "bi-cup-hot",
    };

    return (
        <>
            <style>{`
        :root { --nubix-green: #006634; --text-dark: #1e293b; }
        .navbar-nubix { background-color: #ffffff !important; transition: all 0.3s ease; }
        .btn-categorias-clean { border: 1px solid transparent; padding: 6px 14px; border-radius: 10px; cursor: pointer; color: var(--text-dark); font-size: 0.85rem; font-weight: 500; transition: 0.2s; }
        .btn-categorias-clean:hover { background: #f8fafc; border-color: #e2e8f0; }
        .action-icon-btn { color: var(--text-dark); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 12px; cursor: pointer; }
        .action-icon-btn:hover { background-color: #f1f5f9; color: var(--nubix-green); }
        .cart-badge-premium { background-color: var(--nubix-green) !important; font-size: 0.65rem !important; min-width: 18px; height: 18px; border: 2px solid #fff; }
        .dropdown-menu-wow { border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 16px; padding: 8px; }
        .dropdown-item-custom { display: flex; align-items: center; padding: 10px 15px !important; color: #334155 !important; font-weight: 500; transition: all 0.2s ease; border-radius: 8px; }
        .dropdown-item-custom:hover { background-color: #f0fdf4 !important; color: var(--nubix-green) !important; }
        .dropdown-item-custom i { margin-right: 12px; font-size: 1.1rem; width: 20px; }
        .btn-logout-mini { display: flex; align-items: center; gap: 8px; color: #dc3545; background: #fff5f5; border-radius: 8px; padding: 6px 12px; font-size: 0.75rem; font-weight: 600; border: none; transition: all 0.2s; }
        .btn-logout-mini:hover { background: #fee2e2; }
        .notif-dropdown { width: 320px; max-height: 380px; overflow-y: auto; }
        .notif-item { border-bottom: 1px solid #f1f5f9; padding: 10px 8px; }
        .notif-item:last-child { border-bottom: none; }
        .notif-unread-dot { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; display: inline-block; }
      `}</style>

            <nav
                className={`fixed-top w-100 navbar-nubix ${scrolled ? "shadow-sm" : "border-bottom"}`}
                style={{ zIndex: 1100 }}
            >
                <div className="container py-2">
                    <div className="d-flex align-items-center justify-content-between">
                        <Link to="/">
                            <img
                                src={logoImage}
                                alt="Logo"
                                style={{ height: "36px" }}
                            />
                        </Link>

                        <div
                            className="d-none d-lg-block position-relative"
                            ref={dropdownRef}
                        >
                            <div
                                className="btn-categorias-clean ms-3"
                                onClick={() => setCatOpen(!catOpen)}
                            >
                                <i
                                    className="bi bi-grid-3x3-gap-fill me-2"
                                    style={{ color: "var(--nubix-green)" }}
                                ></i>
                                CATEGORÍAS
                            </div>
                            {catOpen && (
                                <div
                                    className="position-absolute dropdown-menu-wow bg-white mt-2 p-2"
                                    style={{ minWidth: "220px" }}
                                >
                                    {CATEGORIAS_DATA.map((cat, i) => (
                                        <Link
                                            key={i}
                                            to={`/shop?category=${cat.nombre}`}
                                            className="dropdown-item dropdown-item-custom"
                                            onClick={() => setCatOpen(false)}
                                        >
                                            <i
                                                className={`bi ${iconMap[cat.nombre] || "bi-tag"}`}
                                            ></i>
                                            {cat.nombre}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form
                            className="flex-grow-1 mx-md-4 nubix-nav-search"
                            style={{ maxWidth: "380px" }}
                        >
                            <input
                                type="text"
                                className="form-control rounded-pill ps-4"
                                placeholder="¿Qué buscas hoy?"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </form>

                        <div className="d-flex align-items-center gap-2">
                            {token ? (
                                <div
                                    className="position-relative"
                                    ref={userMenuRef}
                                >
                                    <button
                                        className="btn d-flex align-items-center gap-2 border-0"
                                        onClick={() =>
                                            setUserMenuOpen(!userMenuOpen)
                                        }
                                    >
                                        <div className="action-icon-btn">
                                            <i className="bi bi-person"></i>
                                        </div>
                                        <div
                                            className="text-start d-none d-sm-block"
                                            style={{ lineHeight: "1.1" }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "0.6rem",
                                                    color: "#64748b",
                                                }}
                                            >
                                                HOLA,
                                            </div>
                                            <div
                                                className="fw-bold"
                                                style={{
                                                    fontSize: "0.78rem",
                                                    color: "black",
                                                }}
                                            >
                                                {user?.username?.toUpperCase() ||
                                                    "USUARIO"}
                                            </div>
                                        </div>
                                    </button>
                                    {userMenuOpen && (
                                        <div
                                            className="position-absolute end-0 dropdown-menu-wow bg-white mt-2 p-2"
                                            style={{ minWidth: "150px" }}
                                        >
                                            {user?.rol === "ADMIN" && (
                                                <Link
                                                    className="dropdown-item mb-2"
                                                    to="/admin/dashboard"
                                                >
                                                    Panel Admin
                                                </Link>
                                            )}
                                            <button
                                                className="btn-logout-mini w-100"
                                                onClick={handleLogout}
                                            >
                                                <i className="bi bi-box-arrow-left"></i>
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="text-decoration-none d-flex align-items-center gap-2"
                                >
                                    <div className="action-icon-btn">
                                        <i className="bi bi-person"></i>
                                    </div>
                                    <div
                                        className="fw-bold d-none d-sm-block"
                                        style={{
                                            fontSize: "0.78rem",
                                            color: "black",
                                        }}
                                    >
                                        INICIAR SESIÓN
                                    </div>
                                </Link>
                            )}

                            <Link
                                to={token ? "/favorites" : "/login"}
                                className="action-icon-btn text-decoration-none"
                            >
                                <i className="bi bi-heart"></i>
                            </Link>
                            {token && (
                                <div className="position-relative" ref={notifRef}>
                                    <button
                                        type="button"
                                        className="action-icon-btn border-0 bg-transparent position-relative"
                                        onClick={() => setNotifOpen((v) => !v)}
                                        aria-label="Notificaciones"
                                    >
                                        <i className="bi bi-bell"></i>
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
                                                                    {!n.leido && <span className="notif-unread-dot"></span>}
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
                                className="action-icon-btn text-decoration-none position-relative"
                            >
                                <i className="bi bi-cart3"></i>
                                {token && totalItems > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle cart-badge-premium">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <div style={{ marginTop: "75px" }}></div>
        </>
    );
}
