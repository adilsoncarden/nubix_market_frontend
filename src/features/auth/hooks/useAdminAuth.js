import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../../../store/AuthContext";

export const useAdminAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { loginAdmin } = useAuth();
    const navigate = useNavigate();

    const handleAdminLogin = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.adminLogin(credentials);
            if (data.success) {
                // Guardamos en el contexto: { username, rol } y el token
                loginAdmin(
                    {
                        username: data.username,
                        rol: data.rol,
                        id: data.id,
                        permisos: data.permisos ?? [],
                    },
                    data.token,
                );
                navigate("/admin/dashboard"); // Redirección tras éxito
            } else {
                setError(
                    data.message ||
                        "Correo electrónico o contraseña incorrectos. Por favor, inténtelo de nuevo.",
                );
            }
        } catch (err) {
            if (!err.response) {
                setError("No se pudo conectar con el servidor. Intenta de nuevo.");
            } else {
                setError(
                    err.response?.data?.message ||
                        "Correo electrónico o contraseña incorrectos. Por favor, inténtelo de nuevo.",
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return { handleAdminLogin, loading, error };
};
