// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

// Importación de Componentes Globales (Para que no se muevan)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";

// Importación de Páginas
import AdminLogin from "./pages/AdminLogin";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import ClientsPage from "./pages/ClientsPage";
import EmployeesPage from "./pages/EmployeesPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

/**
 * Componente para el Dashboard (Para evitar el error de 'not defined')
 */
const AdminDashboard = () => (
    <div className="container-fluid p-4">
        <div className="card shadow-sm border-0 p-4 bg-white">
            <h2 className="fw-bold text-primary">Panel de Control</h2>
            <p className="text-muted">Bienvenido al sistema de gestión de Nubix Market.</p>
        </div>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* --- GRUPO 1: WEB PÚBLICA (Navbar y Footer siempre visibles) --- */}
                    {/* El secreto es poner el Navbar y Footer como hermanos de un sub-Routes */}
                    <Route
                        path="/*"
                        element={
                            <div className="d-flex flex-column min-vh-100">
                                <Navbar />
                                <div className="flex-grow-1">
                                    <Routes>
                                        <Route path="/" element={<MainContent />} />
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/register" element={<Register />} />
                                        {/* Si alguien busca algo raro en la web pública, vuelve al inicio */}
                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Routes>
                                </div>
                                <Footer />
                            </div>
                        }
                    />

                    {/* --- GRUPO 2: ADMINISTRACIÓN (Sin Navbar de cliente) --- */}
                    <Route path="/admin-login" element={<AdminLogin />} />

                    <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                        <Route element={<AdminLayout />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/categorias" element={<CategoriesPage />} />
                            <Route path="/admin/productos" element={<ProductsPage />} />
                            <Route path="/admin/usuarios/clientes" element={<ClientsPage />} />
                            <Route path="/admin/usuarios/empleados" element={<EmployeesPage />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;