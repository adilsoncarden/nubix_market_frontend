import api from "../../../config/axios";

export const categoryService = {
    getAll: async () => {
        const response = await api.get("/admin/categorias");
        return response.data;
    },
    create: async (categoryData) => {
        const response = await api.post(
            "/admin/categorias/create",
            categoryData,
        );
        return response.data;
    },
    update: async (id, categoryData) => {
        const response = await api.post(
            `/admin/categorias/${id}/update`,
            categoryData,
        );
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/admin/categorias/${id}`);
    },
};
