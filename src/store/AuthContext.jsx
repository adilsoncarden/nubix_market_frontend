import { createContext, useState, useContext, useEffect, useMemo } from "react";
import {
    migrateLegacyAuth,
    saveWebAuthData,
    saveAdminAuthData,
    clearWebAuthData,
    clearAdminAuthData,
    getWebUser,
    getAdminUser,
    getAdminSessionUser,
    isAdminRole,
} from "../utils/authUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [webToken, setWebToken] = useState(null);
    const [webUser, setWebUser] = useState(null);
    const [adminToken, setAdminToken] = useState(null);
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.documentElement.removeAttribute("data-bs-theme");
        migrateLegacyAuth();
        setWebToken(localStorage.getItem("userToken"));
        setWebUser(getWebUser());
        setAdminToken(localStorage.getItem("adminToken"));
        setAdminUser(getAdminUser());
        setLoading(false);
    }, []);

    const loginWeb = (userData, token) => {
        saveWebAuthData(token, userData);
        setWebToken(token);
        setWebUser(userData);
    };

    const loginAdmin = (userData, token) => {
        saveAdminAuthData(token, userData);
        setAdminToken(token);
        setAdminUser(userData);
    };

    const logoutWeb = () => {
        clearWebAuthData();
        setWebToken(null);
        setWebUser(null);
    };

    const logoutAdmin = () => {
        clearAdminAuthData();
        setAdminToken(null);
        setAdminUser(null);
    };

    const adminSessionUser = useMemo(
        () =>
            adminUser ??
            (webToken && isAdminRole(webUser?.rol) ? webUser : null),
        [adminUser, webToken, webUser],
    );

    const canAccessAdmin = useMemo(
        () => !!adminToken || (!!webToken && isAdminRole(webUser?.rol)),
        [adminToken, webToken, webUser],
    );

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                webToken,
                webUser,
                adminToken,
                adminUser,
                adminSessionUser,
                loginWeb,
                loginAdmin,
                logoutWeb,
                logoutAdmin,
                isWebLoggedIn: !!webToken,
                isAdminLoggedIn: !!adminToken,
                canAccessAdmin,
                token: webToken,
                user: webUser,
                login: loginWeb,
                logout: logoutWeb,
                isAuthenticated: !!webToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
};
