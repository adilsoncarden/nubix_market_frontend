import api from "../../../config/axios";

export const saleService = {
    getAll: async () => {
        const response = await api.get("/admin/ventas");
        return response.data;
    },
    create: async (saleData) => {
        const response = await api.post("/admin/ventas/create", saleData);
        return response.data;
    },
    updateStatus: async (id, estado) => {
        const response = await api.post(`/admin/ventas/${id}`, null, {
            params: { estado },
        });
        return response.data;
    },
    registerCredit: async (id) => {
        const response = await api.post(`/admin/ventas/${id}/credito`);
        return response.data;
    },
};
