import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

// Importación de Páginas
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import ClientsPage from "./pages/ClientsPage";
import EmployeesPage from "./pages/EmployeesPage";

/**
 * Componente temporal para el Dashboard
 */
const AdminDashboard = () => (
    <div className="container-fluid">
        <div className="row">
            <div className="col-12">
                <div className="card shadow-sm border-0 p-4 bg-white">
                    <h2 className="fw-bold text-primary">Panel de Control</h2>
                    <p className="text-muted">
                        Bienvenido al sistema de gestión de{" "}
                        <strong>Nubix Market</strong>. Desde aquí puedes
                        administrar categorías, productos y usuarios.
                    </p>
                    <div className="alert alert-success d-inline-block shadow-sm">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Sesión administrativa activa correctamente.
                    </div>
                </div>
            </div>
        </div>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* LA WEB PÚBLICA (Lo primero que se ve) */}
                    <Route path="/" element={<LandingPage />} />

                    {/* LOGIN ADMINISTRATIVO */}
                    <Route path="/admin-login" element={<AdminLogin />} />

                    {/* RUTAS PROTEGIDAS (ADMIN) */}
                    <Route
                        element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
                    >
                        <Route element={<AdminLayout />}>
                            <Route
                                path="/admin/dashboard"
                                element={<AdminDashboard />}
                            />
                            <Route
                                path="/admin/categorias"
                                element={<CategoriesPage />}
                            />
                            <Route
                                path="/admin/productos"
                                element={<ProductsPage />}
                            />
                            <Route
                                path="/admin/usuarios/clientes"
                                element={<ClientsPage />}
                            />
                            <Route
                                path="/admin/usuarios/empleados"
                                element={<EmployeesPage />}
                            />
                        </Route>
                    </Route>

                    {/* SI ESCRIBEN CUALQUIER OTRA COSA, VOLVER A LA WEB */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
