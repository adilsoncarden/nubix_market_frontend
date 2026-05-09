import api from "../../../config/axios";

export const authService = {
    adminLogin: async (credentials) => {
        // credentials = { email, password }
        const response = await api.post("/auth/admin-login", credentials);
        return response.data;
        /* Retorna: { message, rol, success, token, username } */
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
};
