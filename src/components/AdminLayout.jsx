import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../store/AuthContext";
import { useState } from "react";

const AdminLayout = () => {
    const { user } = useAuth();
    
    // El modo oscuro queda comentado/desactivado por ahora
    // const [isDarkMode, setIsDarkMode] = useState(true);
    // const toggleTheme = () => setIsDarkMode(!isDarkMode);
    
    // Forzamos modo claro para que todo se vea bien por el momento
    const isDarkMode = false; 

    return (
        <div 
            className="d-flex vh-100 overflow-hidden" 
            // data-bs-theme={isDarkMode ? "dark" : "light"} // Comentado el cambio de tema
        >
            {/* Sidebar sin pasarle el control de tema por ahora */}
            <Sidebar />

            <div className={`flex-grow-1 d-flex flex-column overflow-hidden bg-light`}>
                <header className="navbar navbar-expand-lg border-bottom px-4 py-3 sticky-top bg-white shadow-sm">
                    <div className="container-fluid p-0">
                        {/* Título de arriba: Normal (Negro) */}
                        <h5 className="m-0 fw-bold text-secondary">
                            Panel de Control
                        </h5>
                        
                        <div className="d-flex align-items-center">
                            {/* Switch de Tema comentado visualmente */}
                            {/* <div className="form-check form-switch me-4 d-flex align-items-center">
                                <input 
                                    className="form-check-input me-2" 
                                    type="checkbox" 
                                    role="switch" 
                                    checked={isDarkMode}
                                    style={{ cursor: 'pointer' }}
                                />
                                <span className="fs-5">☀️</span>
                            </div> 
                            */}

                            <span className="me-3 fw-bold small text-muted">
                                Bienvenido, <span style={{ color: "#198754" }}>{user?.username}</span>
                            </span>
                            
                            <div
                                className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                                style={{ width: "38px", height: "38px", backgroundColor: "#198754" }}
                            >
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 flex-grow-1 overflow-auto bg-light">
                    <div className="container-fluid">
                        <style>
                            {`
                                /* Solo el Panel de Control del BANNER (abajo) es verde */
                                .p-4.shadow-sm h2, 
                                .card h2,
                                .p-4.shadow-sm .text-primary {
                                    color: #198754 !important;
                                }

                                /* Aseguramos legibilidad en el modo claro */
                                .text-muted {
                                    color: #6c757d !important;
                                }

                                .bg-white, .card, .p-4.shadow-sm {
                                    background-color: #ffffff !important;
                                    border: 1px solid #dee2e6 !important;
                                }
                            `}
                        </style>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;