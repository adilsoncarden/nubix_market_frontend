import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import { CartProvider } from "./store/CartContext";
import "./App.css";

import Navbar      from "./components/Navbar";
import Footer      from "./components/Footer";
import MainContent from "./components/MainContent";
import Login       from "./pages/Login";
import Register    from "./pages/Register";
import ShopPage    from "./pages/ShopPage";
import CartPage    from "./pages/CartPage";

// ─── Layout público: Navbar + contenido + Footer ──────────────────────────────
const PublicLayout = () => (
  <div className="d-flex flex-column min-vh-100">
    <Navbar />
    <main className="flex-grow-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>

            {/* WEB PÚBLICA — un único <Routes>, layout via Outlet */}
            <Route element={<PublicLayout />}>
              <Route index          element={<MainContent />} />
              <Route path="/shop"   element={<ShopPage />}   />
              <Route path="/cart"   element={<CartPage />}   />
              <Route path="/login"  element={<Login />}      />
              <Route path="/register" element={<Register />} />
            </Route>

            {/*
              ADMINISTRACIÓN — descomentar cuando los archivos existan:

              import { ProtectedRoute } from "./components/ProtectedRoute";
              import AdminLayout        from "./components/AdminLayout";
              import AdminLogin         from "./pages/AdminLogin";
              import CategoriesPage     from "./pages/CategoriesPage";
              import ProductsPage       from "./pages/ProductsPage";
              import ClientsPage        from "./pages/ClientsPage";
              import EmployeesPage      from "./pages/EmployeesPage";
              import SuppliersPage      from "./pages/SuppliersPage";

              <Route path="/admin-login" element={<AdminLogin />} />
              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard"            element={<AdminDashboard />}  />
                  <Route path="/admin/categorias"           element={<CategoriesPage />}  />
                  <Route path="/admin/productos"            element={<ProductsPage />}    />
                  <Route path="/admin/usuarios/clientes"    element={<ClientsPage />}     />
                  <Route path="/admin/usuarios/empleados"   element={<EmployeesPage />}   />
                  <Route path="/admin/proveedores"          element={<SuppliersPage />}   />
                </Route>
              </Route>
            */}

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}