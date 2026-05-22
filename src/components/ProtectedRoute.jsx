import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token } = useAuth();

    // Si no hay token, redirigir al login
    if (!token) {
        return <Navigate to="/admin-login" replace />;
    }

    // Si hay roles definidos y el usuario no lo tiene, denegar acceso
    if (allowedRoles && !allowedRoles.includes(user?.rol)) {
        return <Navigate to="/admin-login" replace />;
    }

    return <Outlet />;
};
