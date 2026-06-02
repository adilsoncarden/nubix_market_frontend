import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useState } from "react";
import logo from "../assets/logo.png";

const SidebarItem = ({ to, icon, label, active, isSubItem = false, onNavigate }) => (
    <li className="nav-item">
        <Link
            to={to}
            onClick={onNavigate}
            className={`nav-link d-flex align-items-center px-3 py-2 mb-1 rounded-3 transition-all ${
                active
                    ? "active-link shadow-sm text-white"
                    : "text-secondary hover-bg"
            }`}
            style={{ fontSize: isSubItem ? "0.85rem" : "0.95rem" }}
        >
            <i className={`bi ${icon} ${isSubItem ? "fs-7" : "fs-5"} me-3`}></i>
            <span className="fw-medium">{label}</span>
        </Link>
    </li>
);

const Sidebar = ({ isOpen = false, onClose }) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [isUsersOpen, setIsUsersOpen] = useState(
        location.pathname.includes("/admin/usuarios"),
    );

    const handleNavigate = () => {
        onClose?.();
    };

    const menuItems = [
        {
            path: "/admin/dashboard",
            icon: "bi-grid-1x2-fill",
            label: "Dashboard",
        },
        {
            path: "/admin/categorias",
            icon: "bi-tags-fill",
            label: "Categorías",
        },
        {
            path: "/admin/productos",
            icon: "bi-box-seam-fill",
            label: "Productos",
        },
        {
            path: "/admin/proveedores",
            icon: "bi-truck-flatbed",
            label: "Proveedores",
        },
        {
            path: "/admin/ventas",
            icon: "bi-cart-check-fill",
            label: "Ventas",
        },
    ];

    return (
        <aside
            className={`admin-sidebar d-flex flex-column bg-body vh-100 border-end shadow-sm ${isOpen ? "is-open" : ""}`}
        >
            <div className="p-3 mb-1 border-bottom d-flex align-items-center justify-content-between">
                <Link
                    to="/admin/dashboard"
                    className="d-flex align-items-center text-decoration-none mx-auto"
                    onClick={handleNavigate}
                >
                    <div
                        className="admin-sidebar-logo d-flex align-items-center justify-content-center"
                        style={{ width: "100px", height: "100px" }}
                    >
                        <img
                            src={logo}
                            alt="Logo"
                            className="img-fluid"
                            style={{ maxHeight: "100%", objectFit: "contain" }}
                        />
                    </div>
                </Link>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary admin-sidebar-close ms-2"
                    aria-label="Cerrar menú"
                    onClick={onClose}
                >
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>

            <div className="px-3 flex-grow-1 overflow-auto">
                <p
                    className="text-uppercase text-muted fw-bold mb-2 ps-3"
                    style={{ fontSize: "0.65rem", letterSpacing: "1px" }}
                >
                    Menú Principal
                </p>
                <ul className="nav flex-column mb-4">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            to={item.path}
                            icon={item.icon}
                            label={item.label}
                            active={location.pathname === item.path}
                            onNavigate={handleNavigate}
                        />
                    ))}

                    <li className="nav-item">
                        <button
                            onClick={() => setIsUsersOpen(!isUsersOpen)}
                            className={`nav-link w-100 d-flex align-items-center justify-content-between px-3 py-2 rounded-3 border-0 bg-transparent transition-all dropdown-btn ${
                                location.pathname.includes("/admin/usuarios")
                                    ? "text-emerald-600 fw-bold"
                                    : "text-secondary"
                            }`}
                        >
                            <span className="d-flex align-items-center">
                                <i
                                    className={`bi bi-people-fill fs-5 me-3 ${location.pathname.includes("/admin/usuarios") ? "text-emerald-600" : ""}`}
                                ></i>
                                <span className="fw-medium">Usuarios</span>
                            </span>
                            <i
                                className={`bi bi-chevron-${isUsersOpen ? "down" : "right"} small opacity-50`}
                            ></i>
                        </button>

                        <div
                            className={`collapse ${isUsersOpen ? "show" : ""} mt-1`}
                        >
                            <ul className="nav flex-column ms-4 border-start ps-2">
                                <SidebarItem
                                    to="/admin/usuarios/clientes"
                                    icon="bi-dot"
                                    label="Clientes"
                                    active={
                                        location.pathname ===
                                        "/admin/usuarios/clientes"
                                    }
                                    isSubItem
                                    onNavigate={handleNavigate}
                                />
                                <SidebarItem
                                    to="/admin/usuarios/empleados"
                                    icon="bi-dot"
                                    label="Empleados"
                                    active={
                                        location.pathname ===
                                        "/admin/usuarios/empleados"
                                    }
                                    isSubItem
                                    onNavigate={handleNavigate}
                                />
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="p-3 mt-auto border-top bg-body-secondary">
                <div className="d-flex align-items-center p-2 rounded-4 bg-body shadow-sm border mb-3">
                    <div className="flex-shrink-0">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center border border-success border-2"
                            style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: "var(--admin-accent-soft, #ecfdf5)",
                            }}
                        >
                            <span className="text-emerald-600 fw-bold">
                                {user?.username?.charAt(0).toUpperCase() ||
                                    "A"}
                            </span>
                        </div>
                    </div>
                    <div className="flex-grow-1 ms-3 min-w-0">
                        <p
                            className="mb-0 text-body fw-bold text-truncate"
                            style={{ fontSize: "0.9rem" }}
                        >
                            {user ? user.username : "Admin"}
                        </p>
                        <p
                            className="mb-0 text-muted text-uppercase fw-semibold"
                            style={{ fontSize: "0.65rem" }}
                        >
                            Administrador
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="btn btn-outline-danger w-100 border-0 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3"
                >
                    <i className="bi bi-box-arrow-right"></i>
                    <span className="fw-bold small">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
