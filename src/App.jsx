import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import AdminLogin from "./pages/AdminLogin";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

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
                    {/* 1. RUTAS PÚBLICAS: No tienen Sidebar ni protección */}
                    <Route path="/admin-login" element={<AdminLogin />} />

                    {/* 2. CAPA DE SEGURIDAD: Verifica que sea ADMIN */}
                    <Route
                        element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
                    >
                        {/* 3. CAPA DE DISEÑO: Envuelve las rutas con el Sidebar y Header */}
                        <Route element={<AdminLayout />}>
                            <Route
                                path="/admin/dashboard"
                                element={<AdminDashboard />}
                            />
                            {/* Los nuevos módulos se agregan aquí dentro para que hereden el Layout */}
                            {/* <Route path="/admin/categorias" element={<CategoriasPage />} /> */}
                        </Route>
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
