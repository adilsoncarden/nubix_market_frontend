import api from "../../../config/axios";
import { unwrapApiList } from "../../../config/apiUtils";

export const saleService = {
    getAll: async () => {
        const response = await api.get("/admin/ventas");
        return unwrapApiList(response.data);
    },

    getById: async (id) => {
        const response = await api.get(`/admin/ventas/${id}`);
        return response.data;
    },

    create: async (saleData) => {
        const response = await api.post("/admin/ventas/create", saleData);
        return response.data;
    },

    checkout: async (checkoutData) => {
        const response = await api.post("/ventas/checkout", checkoutData);
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
