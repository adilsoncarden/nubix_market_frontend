import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useState } from "react";
import logo from "../assets/logo.png";

const SidebarItem = ({ to, icon, label, active, isSubItem = false }) => (
    <li className="nav-item">
        <Link
            to={to}
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

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [isUsersOpen, setIsUsersOpen] = useState(
        location.pathname.includes("/admin/usuarios"),
    );

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
    ];

    return (
        <aside
            className="d-flex flex-column bg-white vh-100 border-end shadow-sm"
            style={{ width: "280px" }}
        >
            <style>{`
                .active-link { background-color: #10b981 !important; }
                .text-emerald-600 { color: #10b981 !important; }
                .hover-bg:hover { background-color: #f0fdf4; color: #10b981 !important; }
                .transition-all { transition: all 0.2s ease-in-out; }
                .fs-7 { font-size: 0.8rem; }
                .dropdown-btn:hover { background-color: #f8f9fa; }
                .avatar-border { border: 2px solid #10b981; padding: 2px; }
            `}</style>

            {/* Logo / Brand Centrar el logo */}
            <div className="p-4 mb-2 border-bottom d-flex justify-content-center height">
                <Link
                    to="/admin/dashboard"
                    className="d-flex align-items-center text-decoration-none"
                >
                    <div
                        className="me-2 d-flex align-items-center justify-content-center"
                        style={{ width: "100px", height: "100px" }}
                    >
                        <img
                            src={logo}
                            alt="Logo"
                            className="img-fluid"
                            style={{ maxHeight: "100%", objectFit: "contain" }}
                        />
                    </div>
                    {/* <span className="fs-4 fw-bold tracking-tight text-dark">
                        Nubix<span className="text-muted fw-light">Market</span>
                    </span> */}
                </Link>
            </div>

            {/* Navigation */}
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
                                />
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>

            {/* User Profile Section (Restaurado) */}
            <div className="p-3 mt-auto border-top bg-light/50">
                <div className="d-flex align-items-center p-2 rounded-4 bg-white shadow-sm border mb-3">
                    <div className="flex-shrink-0">
                        <div className="avatar-border rounded-circle">
                            <div
                                className="bg-emerald-100 rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: "#ecfdf5",
                                }}
                            >
                                <span className="text-emerald-700 fw-bold">
                                    {user?.username?.charAt(0).toUpperCase() ||
                                        "A"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow-1 ms-3 min-w-0">
                        <p
                            className="mb-0 text-dark fw-bold text-truncate"
                            style={{ fontSize: "0.9rem" }}
                        >
                            {user ? user.username : "Adilson"}
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
                    className="btn btn-outline-danger w-100 border-0 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 hover-danger transition-all font-bold"
                >
                    <i className="bi bi-box-arrow-right"></i>
                    <span className="fw-bold small">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
