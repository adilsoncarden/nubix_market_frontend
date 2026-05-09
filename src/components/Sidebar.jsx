import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        {
            path: "/admin/dashboard",
            icon: "bi-speedometer2",
            label: "Dashboard",
        },
        { path: "/admin/categorias", icon: "bi-tags", label: "Categorías" },
        { path: "/admin/productos", icon: "bi-box-seam", label: "Productos" },
        { path: "/admin/usuarios", icon: "bi-people", label: "Usuarios" },
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
                {menuItems.map((item) => (
                    <li key={item.path} className="nav-item">
                        <Link
                            to={item.path}
                            className={`nav-link text-white ${location.pathname === item.path ? "active" : ""}`}
                        >
                            <i className={`bi ${item.icon} me-2`}></i>
                            {item.label}
                        </Link>
                    </li>
                ))}
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
