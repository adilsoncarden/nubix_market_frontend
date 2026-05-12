import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useState } from "react";

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const [isUsersOpen, setIsUsersOpen] = useState(
        location.pathname.includes("/admin/usuarios"),
    );

    const menuItems = [
        { path: "/admin/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
        { path: "/admin/categorias", icon: "bi-tags", label: "Categorías" },
        { path: "/admin/productos", icon: "bi-box-seam", label: "Productos" },
        { path: "/admin/proveedores", icon: "bi-truck", label: "Proveedores" },
    ];

    return (
        <div
            className="d-flex flex-column flex-shrink-0 p-3 bg-white vh-100 shadow-sm border-end"
            style={{ width: "280px" }}
        >
            <style>
                {`
                    .nav-pills .nav-link {
                        color: #495057;
                        transition: all 0.3s ease;
                        font-weight: 500;
                    }
                    .nav-pills .nav-link:hover {
                        background-color: #f8f9fa;
                        color: #198754;
                    }
                    .nav-pills .nav-link.active {
                        background-color: #198754 !important;
                        color: white !important;
                        box-shadow: 0 4px 10px rgba(25, 135, 84, 0.2);
                    }
                `}
            </style>

            {/* Logo */}
            <Link
                to="/admin/dashboard"
                className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none"
            >
                <i className="bi bi-shop text-success fs-3 me-2"></i>
                <span className="fs-4 fw-bold">
                    <span style={{ color: "#198754" }}>Nubix</span> <span className="text-dark">Market</span>
                </span>
            </Link>
            <hr className="text-muted" />

            <ul className="nav nav-pills flex-column mb-auto">
                {menuItems.map((item) => (
                    <li key={item.path} className="nav-item mb-1">
                        <Link
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                        >
                            <i className={`bi ${item.icon} me-2`}></i>
                            {item.label}
                        </Link>
                    </li>
                ))}

                <li className="nav-item mb-1">
                    <button
                        onClick={() => setIsUsersOpen(!isUsersOpen)}
                        className={`nav-link w-100 text-start d-flex justify-content-between align-items-center ${
                            location.pathname.includes("/admin/usuarios") ? "text-success fw-bold" : ""
                        }`}
                        style={{ border: "none", background: "none" }}
                    >
                        <span>
                            <i className="bi bi-people me-2"></i>
                            Usuarios
                        </span>
                        <i className={`bi bi-chevron-${isUsersOpen ? "down" : "right"} small`}></i>
                    </button>

                    <div className={`collapse ${isUsersOpen ? "show" : ""} ms-3`}>
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li>
                                <Link
                                    to="/admin/usuarios/clientes"
                                    className={`nav-link mb-1 ${location.pathname === "/admin/usuarios/clientes" ? "active" : ""}`}
                                >
                                    <i className="bi bi-person-badge me-2"></i> Clientes
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/usuarios/empleados"
                                    className={`nav-link mb-1 ${location.pathname === "/admin/usuarios/empleados" ? "active" : ""}`}
                                >
                                    <i className="bi bi-person-workspace me-2"></i> Empleados
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>

            <hr className="text-muted" />

            {/* Perfil con orden invertido */}
            <div className="d-flex flex-column align-items-center mb-3 py-2">
                <div 
                    className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-2 shadow-sm"
                    style={{ width: "60px", height: "60px", border: "2px solid #198754" }}
                >
                    <i className="bi bi-person-fill text-success fs-1"></i>
                </div>
                <div className="text-center">
                    {/* Primero el nombre del usuario logueado */}
                    <h6 className="m-0 fw-bold text-dark">
                        {user ? user.username : "Usuario"}
                    </h6>
                    {/* Abajo Admin Nubix fijo */}
                    <span className="text-muted fw-bold text-uppercase" style={{ fontSize: "0.75rem" }}>
                        Admin 
                    </span>
                </div>
            </div>

            <button
                onClick={logout}
                className="btn btn-outline-danger btn-sm w-100"
            >
                <i className="bi bi-door-open me-2"></i> Cerrar Sesión
            </button>
        </div>
    );
};

export default Sidebar;