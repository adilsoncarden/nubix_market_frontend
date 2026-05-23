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

    // SUBIR IMAGEN
    uploadImage: async (file) => {

        const formData = new FormData();

        formData.append("archivo", file);

        const response = await api.post(
            "/admin/productos/imagenes/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

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

    assignImage: async (productoId, imagenId) => {

    const response = await api.put(
        `/admin/productos/${productoId}`,
        null,
        {
            params: {
                imagenId,
            },
        }
    );

    return response.data;
  },
};
