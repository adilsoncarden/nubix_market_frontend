import api from "../../../config/axios";
import { unwrapApiList } from "../../../config/apiUtils";

const API_ORIGIN = (
    import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
    "http://localhost:8080"
).replace(/\/$/, "");

export const getProductImageUrl = (imagen) => {
    if (!imagen?.archivo) return null;
    return `${API_ORIGIN}/uploads/${imagen.archivo}`;
};

/** Solo query param; evita headers custom que rompen CORS preflight. */
const noCacheConfig = (bustCache) =>
    bustCache ? { params: { _: Date.now() } } : {};

export const productService = {
    /** Mismo ProductoResponse que admin; endpoint público de tienda. */
    getCatalog: async ({ bustCache = false } = {}) => {
        const response = await api.get(
            "/catalogo/productos",
            noCacheConfig(bustCache),
        );
        return unwrapApiList(response.data);
    },

    getCatalogCategories: async ({ bustCache = false } = {}) => {
        const response = await api.get(
            "/catalogo/categorias",
            noCacheConfig(bustCache),
        );
        return unwrapApiList(response.data);
    },

    getAll: async ({ bustCache = false } = {}) => {
        const response = await api.get(
            "/admin/productos",
            noCacheConfig(bustCache),
        );
        return unwrapApiList(response.data);
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

    uploadProductImage: async (productoId, file) => {
        const formData = new FormData();
        formData.append("archivo", file);
        const response = await api.post(
            `/admin/productos/${productoId}/imagen`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        return response.data;
    },

    deleteProductImage: async (productoId) => {
        const response = await api.delete(
            `/admin/productos/${productoId}/imagen`,
        );
        return response.data;
    },
};
