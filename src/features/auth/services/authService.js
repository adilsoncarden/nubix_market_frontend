import api from "../../../config/axios";

export const authService = {
    adminLogin: async (credentials) => {
        const response = await api.post("/auth/admin-login", credentials);
        return response.data;
    },

    // Cambiamos el nombre del parámetro a 'code' para que sea coherente con ResetPassword.jsx
    // Localiza esta función en tu authService.js
    resetPassword: async (email, code, password) => {
        // La URL debe ser limpia para que entre en el .permitAll()
        const response = await api.post("/auth/reset-password", {
            email: email,
            codigo: code,
            nuevaContraseña: password,
        });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    forgotPassword: async (email) => {
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    },
};
