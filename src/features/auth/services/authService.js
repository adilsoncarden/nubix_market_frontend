import api from "../../../config/axios";

export const authService = {
    adminLogin: async (credentials) => {
        const response = await api.post("/auth/admin-login", credentials);
        return response.data;
    },

    verifyCode: async (email, code) => {
        const response = await api.post("/auth/verify-code/", {
            email: email,
            codigo: code,
        });
        return response.data;
    },

    resetPassword: async (email, code, password) => {
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
