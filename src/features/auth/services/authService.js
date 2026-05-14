import api from "../../../config/axios";

export const authService = {
    adminLogin: async (credentials) => {
        // credentials = { email, password }
        const response = await api.post("/auth/admin-login", credentials);
        return response.data;
        /* Retorna: { message, rol, success, token, username } */
    },
    resetPassword: async (token, password) => {
        // POST /auth/reset-password/:token { password }
        const response = await api.post(`/auth/reset-password/${token}`, {
            password,
        });
        return response.data;
    },


    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
    forgotPassword: async (email) => {
        // POST /auth/forgot-password { email }
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    },
};
