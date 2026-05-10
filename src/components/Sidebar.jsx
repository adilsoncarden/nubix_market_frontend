import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useState } from "react";

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    // Estado para controlar el despliegue de Usuarios
    const [isUsersOpen, setIsUsersOpen] = useState(
        location.pathname.includes("/admin/usuarios"),
    );

    const menuItems = [
        {
            path: "/admin/dashboard",
            icon: "bi-speedometer2",
            label: "Dashboard",
        },
        { path: "/admin/categorias", icon: "bi-tags", label: "Categorías" },
        { path: "/admin/productos", icon: "bi-box-seam", label: "Productos" },
        // Módulo de Proveedores añadido siguiendo tu estándar
        { path: "/admin/proveedores", icon: "bi-truck", label: "Proveedores" },
    ];

    return (
        <div
            className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100 shadow"
            style={{ width: "280px" }}
        >
            <Link
                to="/admin/dashboard"
                className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
            >
                <span className="fs-4 fw-bold text-primary">
                    Nubix <span className="text-white">Market</span>
                </span>
            </Link>
            <hr />

            <ul className="nav nav-pills flex-column mb-auto">
                {/* Items normales (Incluye ahora Suppliers) */}
                {menuItems.map((item) => (
                    <li key={item.path} className="nav-item mb-1">
                        <Link
                            to={item.path}
                            className={`nav-link text-white ${location.pathname === item.path ? "active" : ""}`}
                        >
                            <i className={`bi ${item.icon} me-2`}></i>
                            {item.label}
                        </Link>
                    </li>
                ))}

                {/* Item Desplegable: Usuarios */}
                <li className="nav-item mb-1">
                    <button
                        onClick={() => setIsUsersOpen(!isUsersOpen)}
                        className={`nav-link text-white w-100 text-start d-flex justify-content-between align-items-center ${
                            location.pathname.includes("/admin/usuarios")
                                ? "bg-secondary bg-opacity-25"
                                : ""
                        }`}
                        style={{ border: "none", background: "none" }}
                    >
                        <span>
                            <i className="bi bi-people me-2"></i>
                            Usuarios
                        </span>
                        <i
                            className={`bi bi-chevron-${isUsersOpen ? "down" : "right"} small`}
                        ></i>
                    </button>

                    <div
                        className={`collapse ${isUsersOpen ? "show" : ""} ms-3`}
                    >
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li>
                                <Link
                                    to="/admin/usuarios/clientes"
                                    className={`nav-link text-white opacity-75 ${location.pathname === "/admin/usuarios/clientes" ? "active fw-bold text-primary opacity-100" : ""}`}
                                >
                                    <i className="bi bi-person-badge me-2"></i>{" "}
                                    Clientes
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/usuarios/empleados"
                                    className={`nav-link text-white opacity-75 ${location.pathname === "/admin/usuarios/empleados" ? "fw-bold text-primary opacity-100" : ""}`}
                                >
                                    <i className="bi bi-person-workspace me-2"></i>{" "}
                                    Empleados
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>

            <hr />
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
