import api from "../../../config/axios";
import { clearAllAuthData } from "../../../utils/authUtils";

export const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post("/auth/login", credentials);
            return response.data;
        } catch (error) {
            const data = error.response?.data;
            if (data) {
                if (typeof data === "object" && data.message && data.success === undefined) {
                    return {
                        success: false,
                        message: data.message,
                    };
                }
                return data;
            }
            throw error;
        }
    },

    register: async (userData) => {
        const response = await api.post("/auth/register", userData);
        return response.data;
    },

    fetchAdminPermisos: async () => {
        const response = await api.get("/auth/admin-permisos");
        return Array.isArray(response.data) ? response.data : [];
    },

    adminLogin: async (credentials) => {
        try {
            const response = await api.post("/auth/admin-login", credentials);
            return response.data;
        } catch (error) {
            const data = error.response?.data;
            if (data) {
                if (typeof data === "object" && data.message && data.success === undefined) {
                    return {
                        success: false,
                        message: data.message,
                    };
                }
                return data;
            }
            throw error;
        }
    },

    verifyCode: async (email, code) => {
        const response = await api.post("/auth/verify-code", {
            email,
            codigo: code,
        });
        return response.data;
    },

    resetPassword: async (email, code, password) => {
        const response = await api.post("/auth/reset-password", {
            email,
            codigo: code,
            nuevaContraseña: password,
        });
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    },

    logout: () => {
        clearAllAuthData();
    },
};
