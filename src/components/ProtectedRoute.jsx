import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { setRedirectUrl } from "../utils/authUtils";

export const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token } = useAuth();
    const location = useLocation();

    // Si no hay token, guardar URL destino y redirigir al login
    if (!token) {
        // ✅ Guardar a dónde quería ir (para volver después del login)
        setRedirectUrl(location.pathname + location.search);
        return <Navigate to="/login" replace />;
    }

    // Si hay roles definidos y el usuario no lo tiene, denegar acceso
    if (allowedRoles && !allowedRoles.includes(user?.rol)) {
        return <Navigate to="/admin-login" replace />;
    }

    return <Outlet />;
};
