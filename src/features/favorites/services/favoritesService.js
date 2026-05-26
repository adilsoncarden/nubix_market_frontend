import api from "../../../config/axios";
import { unwrapApiList } from "../../../config/apiUtils";

export const favoritesService = {
    list: async () => {
        const res = await api.get("/favoritos");
        return unwrapApiList(res.data);
    },
    toggle: async (productoId) => {
        const res = await api.post(`/favoritos/${productoId}/toggle`);
        return res.data; // boolean
    },
    remove: async (productoId) => {
        await api.delete(`/favoritos/${productoId}`);
    },
};

