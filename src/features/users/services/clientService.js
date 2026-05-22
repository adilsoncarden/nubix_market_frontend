import api from "../../../config/axios";

export const clientService = {
    getAll: async () => {
        const response = await api.get("/admin/clientes");
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/admin/clientes/${id}`);
        return response.data;
    },

    // Ajustado a tu ruta específica de Backend
    update: async (id, userData) => {
        const response = await api.post(
            `/admin/clientes/${id}/update`,
            userData,
        );
        return response.data;
    },
};
