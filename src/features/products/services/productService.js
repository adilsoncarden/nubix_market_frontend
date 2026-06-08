import api from "../../../config/axios";
import { unwrapApiList } from "../../../config/apiUtils";
import { mapProductPayload } from "../../../utils/productPayload";

export const PRODUCT_PLACEHOLDER_IMAGE =
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";

export const resolveProductImageUrl = (producto) => {
    const url = producto?.urlImagen;
    return url ? String(url).trim() : null;
};

export const handleProductImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
};

const noCacheConfig = (bustCache) =>
    bustCache ? { params: { _: Date.now() } } : {};

export const productService = {
    getCatalog: async ({ bustCache = false } = {}) => {
        const response = await api.get(
            "/catalogo/productos",
            noCacheConfig(bustCache),
        );
        return unwrapApiList(response.data);
    },

    getCatalogById: async (id) => {
        const response = await api.get(`/catalogo/productos/${id}`);
        return response.data;
    },

    getCatalogCategories: async ({ bustCache = false } = {}) => {
        const response = await api.get(
            "/catalogo/categorias",
            noCacheConfig(bustCache),
        );
        return unwrapApiList(response.data);
    },

    getAll: async ({ bustCache = false, silent403 = false } = {}) => {
        const response = await api.get("/admin/productos", {
            ...noCacheConfig(bustCache),
            silent403,
        });
        return unwrapApiList(response.data);
    },

    create: async (productData) => {
        const response = await api.post(
            "/admin/productos/create",
            mapProductPayload(productData),
        );
        return response.data;
    },

    update: async (id, productData) => {
        const response = await api.put(
            `/admin/productos/${id}/update`,
            mapProductPayload(productData),
        );
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/admin/productos/${id}/delete`);
    },
};
