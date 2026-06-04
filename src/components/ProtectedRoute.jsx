import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { isPanelEligibleRole } from "../utils/authUtils";

export const ProtectedRoute = ({ allowedRoles = null }) => {
    const { adminToken, webToken, webUser, adminUser } = useAuth();
    const location = useLocation();

    const sessionUser = adminUser ?? webUser;
    const hasAdminSession =
        !!adminToken || (!!webToken && isPanelEligibleRole(webUser?.rol));

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
