import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import AdminLogin from "./pages/AdminLogin";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Componente temporal para probar el éxito
const AdminDashboard = () => (
    <div className="container mt-5">
        <div className="alert alert-success shadow">
            <h1>¡Login Exitoso!</h1>
            <p>Bienvenido al Panel de Administración de Nubix Market.</p>
        </div>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Rutas Públicas */}
                    <Route path="/admin-login" element={<AdminLogin />} />

                    {/* Rutas Protegidas de Administración */}
                    <Route
                        element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
                    >
                        <Route
                            path="/admin/dashboard"
                            element={<AdminDashboard />}
                        />
                        {/* Aquí irán /admin/categorias, /admin/productos, etc. */}
                    </Route>

                    {/* Redirección por defecto */}
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
