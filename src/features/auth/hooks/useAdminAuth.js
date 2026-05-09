import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../../../store/AuthContext";

export const useAdminAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleAdminLogin = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.adminLogin(credentials);
            if (data.success) {
                // Guardamos en el contexto: { username, rol } y el token
                login({ username: data.username, rol: data.rol }, data.token);
                navigate("/admin/dashboard"); // Redirección tras éxito
            } else {
                setError(data.message || "Error de autenticación");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Error al conectar con el servidor",
            );
        } finally {
            setLoading(false);
        }
    };

    return { handleAdminLogin, loading, error };
};
