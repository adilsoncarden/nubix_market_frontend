import api from "../../../config/axios";

const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
};

export const reportService = {
    exportProducts: async ({
        categoriaId,
        stockBajo,
        precioMin,
        precioMax,
    } = {}) => {
        const params = {};
        if (categoriaId) params.categoriaId = categoriaId;
        if (stockBajo) params.stockBajo = true;
        if (precioMin != null && precioMin !== "")
            params.precioMin = Number(precioMin);
        if (precioMax != null && precioMax !== "")
            params.precioMax = Number(precioMax);
        const response = await api.get("/admin/reportes/productos", {
            params,
            responseType: "blob",
        });
        downloadBlob(response.data, "productos.xlsx");
    },

    exportCategories: async () => {
        const response = await api.get("/admin/reportes/categorias", {
            responseType: "blob",
        });
        downloadBlob(response.data, "categorias.xlsx");
    },

    exportSuppliers: async () => {
        const response = await api.get("/admin/reportes/proveedores", {
            responseType: "blob",
        });
        downloadBlob(response.data, "proveedores.xlsx");
    },

    exportSales: async (desde, hasta) => {
        const response = await api.get("/admin/reportes/ventas", {
            params: { desde, hasta },
            responseType: "blob",
        });
        downloadBlob(response.data, `ventas_${desde}_${hasta}.xlsx`);
    },
};
