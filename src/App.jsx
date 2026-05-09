import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

// Importación de Páginas
import AdminLogin from "./pages/AdminLogin";
import CategoriesPage from "./pages/CategoriesPage";

/**
 * Componente temporal para el Dashboard
 * En el futuro se moverá a su propio archivo en src/pages/AdminDashboard.jsx
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
                    {/* 
                        RUTAS PÚBLICAS 
                        No requieren token y no muestran el Sidebar.
                    */}
                    <Route path="/admin-login" element={<AdminLogin />} />

                    {/* 
                        RUTAS PROTEGIDAS (SISTEMA ADMINISTRATIVO) 
                        1. Verificamos que el usuario esté autenticado y sea ADMIN.
                        2. Aplicamos el Layout (Sidebar + Header) a todas las rutas internas.
                    */}
                    <Route
                        element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
                    >
                        <Route element={<AdminLayout />}>
                            {/* Dashboard Principal */}
                            <Route
                                path="/admin/dashboard"
                                element={<AdminDashboard />}
                            />

                            {/* Gestión de Categorías (CRUD con Modales) */}
                            <Route
                                path="/admin/categorias"
                                element={<CategoriesPage />}
                            />

                            {/* 
                                Espacio para futuros módulos:
                                <Route path="/admin/productos" element={<ProductsPage />} />
                                <Route path="/admin/usuarios" element={<UsersPage />} />
                            */}
                        </Route>
                    </Route>

                    {/* 
                        GESTIÓN DE RUTAS NO ENCONTRADAS
                        Redirige automáticamente al login si la ruta no existe.
                    */}
                    <Route
                        path="*"
                        element={<Navigate to="/admin-login" replace />}
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
