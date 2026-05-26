import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";

import { AuthProvider } from "./store/AuthContext";
import { CartProvider } from "./store/CartContext";
import { ProductCatalogProvider } from "./store/ProductCatalogContext";

import "./App.css";

// ───────────────── COMPONENTES GLOBALES ─────────────────
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import AdminLayout from "./components/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

// ───────────────── PÁGINAS PÚBLICAS ─────────────────
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import ProductDetail from "./pages/ProductDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordManual from "./pages/ResetPasswordManual";

// ───────────────── PÁGINAS ADMIN ─────────────────
import AdminLogin from "./pages/AdminLogin";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import ClientsPage from "./pages/ClientsPage";
import EmployeesPage from "./pages/EmployeesPage";
import SuppliersPage from "./pages/SuppliersPage";
import SalesPage from "./pages/SalesPage";

// ───────────────── LAYOUT PÚBLICO ─────────────────
const PublicLayout = () => (
    <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-grow-1">
            <Outlet />
        </main>

        <Footer />
    </div>
);

// ───────────────── DASHBOARD ADMIN ─────────────────
const AdminDashboard = () => (
    <div className="container-fluid p-4">
        <div className="card shadow-sm border-0 p-4 bg-white">
            <h2 className="fw-bold text-primary">Panel de Control</h2>

            <p className="text-muted">
                Bienvenido al sistema de gestión de Nubix Market.
            </p>
        </div>
    </div>
);

// ───────────────── APP ─────────────────
export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ProductCatalogProvider>
                    <CartProvider>
                    <Routes>
                        {/* ───────────── WEB PÚBLICA ───────────── */}
                        <Route element={<PublicLayout />}>
                            {/* HOME */}
                            <Route index element={<MainContent />} />

                            {/* TIENDA */}
                            <Route path="/producto/:id" element={<ProductDetail />} />
                            <Route path="/shop" element={<ShopPage />} />
                            <Route path="/cart" element={<CartPage />} />

                            {/* AUTH */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* RECUPERAR CONTRASEÑA */}
                            <Route
                                path="/forgot-password"
                                element={<ForgotPassword />}
                            />

                            <Route
                                path="/reset-password/manual"
                                element={<ResetPasswordManual />}
                            />

                            <Route
                                path="/reset-password/:token"
                                element={<ResetPassword />}
                            />
                        </Route>

                        {/* ───────────── LOGIN ADMIN ───────────── */}
                        <Route path="/admin-login" element={<AdminLogin />} />

                        {/* ───────────── RUTAS PROTEGIDAS ADMIN ───────────── */}
                        <Route
                            element={
                                <ProtectedRoute allowedRoles={["ADMIN"]} />
                            }
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

                                <Route
                                    path="/admin/proveedores"
                                    element={<SuppliersPage />}
                                />

                                <Route
                                    path="/admin/ventas"
                                    element={<SalesPage />}
                                />
                            </Route>
                        </Route>

                        {/* ───────────── FALLBACK ───────────── */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    </CartProvider>
                </ProductCatalogProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
