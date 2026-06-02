import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { setRedirectUrl } from "../utils/authUtils";

export const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token } = useAuth();
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");

    if (!token) {
        setRedirectUrl(location.pathname + location.search);
        return (
            <Navigate
                to={isAdminRoute ? "/admin-login" : "/login"}
                replace
            />
        );
    }

    if (allowedRoles && !allowedRoles.includes(user?.rol)) {
        return <Navigate to={isAdminRoute ? "/admin-login" : "/"} replace />;
    }

    return <Outlet />;
};
