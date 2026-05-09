import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../store/AuthContext";

const AdminLayout = () => {
    const { user } = useAuth();

    return (
        <div className="d-flex overflow-hidden">
            {/* Sidebar Fijo */}
            <Sidebar />

            {/* Área de Contenido Principal */}
            <div className="flex-grow-1 overflow-auto bg-light vh-100">
                <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-3 sticky-top">
                    <div className="container-fluid p-0">
                        <h5 className="m-0 text-secondary">Panel de Control</h5>
                        <div className="d-flex align-items-center">
                            <span className="me-3 fw-bold small text-muted">
                                Bienvenido,{" "}
                                <span className="text-primary">
                                    {user?.username}
                                </span>
                            </span>
                            <div
                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: "35px", height: "35px" }}
                            >
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4">
                    <Outlet />{" "}
                    {/* Aquí se renderizarán los módulos (Dashboard, Categorías, etc.) */}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
