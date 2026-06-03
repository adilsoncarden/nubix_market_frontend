import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { isAdminRole } from "../utils/authUtils";

export const ProtectedRoute = ({
    allowedRoles = ["ADMIN", "EMPLEADO", "REPARTIDOR"],
}) => {
    const { adminToken, webToken, webUser, adminUser } = useAuth();
    const location = useLocation();

    const sessionUser = adminUser ?? webUser;
    const hasAdminSession = !!adminToken || (!!webToken && isAdminRole(webUser?.rol));

    if (!hasAdminSession) {
        return <Navigate to="/admin-login" replace state={{ from: location }} />;
    }

    const effectiveRole = sessionUser?.rol;
    if (
        allowedRoles?.length &&
        effectiveRole &&
        !allowedRoles.includes(effectiveRole)
    ) {
        return <Navigate to="/admin-login" replace />;
    }

    return <Outlet />;
};
