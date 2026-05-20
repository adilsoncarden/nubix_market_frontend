import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import { CartProvider } from "./store/CartContext";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Import manual reset page
import ResetPasswordManual from "./pages/ResetPasswordManual";

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
                            <Route index element={<MainContent />} />
                            <Route path="/shop" element={<ShopPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
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

                        {/*


                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
