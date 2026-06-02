import { createContext, useState, useContext, useEffect } from "react";
import { saveAuthData, clearAuthData } from "../utils/authUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("user");
            if (saved && token) {
                setUser(JSON.parse(saved));
            }
        } catch {
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    }, [token]);

    /**
     * Login: Guarda token y datos del usuario de forma centralizada
     * @param {object} userData - Datos del usuario {username, rol, ...}
     * @param {string} userToken - Token JWT
     */
    const login = (userData, userToken) => {
        saveAuthData(userToken, userData);
        setToken(userToken);
        setUser(userData);
    };

    /**
     * Logout: Limpia TODOS los datos de autenticación
     */
    const logout = () => {
        clearAuthData();
        setToken(null);
        setUser(null);
    };

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
            value={{ user, token, login, logout, isAuthenticated: !!token }}
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
