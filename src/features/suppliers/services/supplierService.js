import clienteAxios from "../../../config/axios";

// Obtener todos los proveedores
export const getSuppliers = async () => {
    const response = await clienteAxios.get("/admin/proveedores");
    return response.data;
};

// Crear un nuevo proveedor
export const createSupplier = async (supplierData) => {
    const response = await clienteAxios.post(
        "/admin/proveedores/create",
        supplierData,
    );
    return response.data;
};

// Actualizar proveedor existente
export const updateSupplier = async (id, supplierData) => {
    const response = await clienteAxios.post(
        `/admin/proveedores/${id}/update`,
        supplierData,
    );
    return response.data;
};

// Eliminar proveedor
export const deleteSupplier = async (id) => {
    const response = await clienteAxios.delete(`/admin/proveedores/${id}/delete`);
    return response.data;
};
