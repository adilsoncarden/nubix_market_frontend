import api from "../../../config/axios";

export const productService = {

    // Obtener Producto
    getAll: async () => {
        const response = await api.get("/admin/productos");
        return response.data;
    },

    // Obtener Imágenes

    getImages: async () => {

        const response = await api.get("/admin/productos/imagenes");
        return response.data;
    },

    // Crear Producto
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

    // ASIGNAR IMAGEN A PRODUCTO

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

  // ACTUALIZAR PRODUCTO  - (solo lo cambie de lugar)
    update: async (id, productData) => {

        const response = await api.put(
            `/admin/productos/update/${id}`,
            productData,
        );

        return response.data;
    },

    // ELIMINAR PRODUCTO
    delete: async (id) => {

        await api.delete(
            `/admin/productos/${id}`
        );
    }
};
