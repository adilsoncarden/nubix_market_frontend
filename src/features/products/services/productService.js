import api from "../../../config/axios";

export const productService = {
    getAll: async () => {
        const response = await api.get("/admin/productos");
        return response.data;
    },
    create: async (productData) => {
        const response = await api.post("/admin/productos/create", productData);
        return response.data;
    },
    update: async (id, productData) => {
        const response = await api.put(
            `/admin/productos/update/${id}`,
            productData,
        );
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/admin/productos/${id}`);
    },
};
