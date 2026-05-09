import api from "../../../config/axios";

export const employeeService = {
    // Listar empleados y admins
    getAll: async () => {
        const response = await api.get("/admin/empleados-admins");
        return response.data;
    },

    // Crear nuevo empleado
    create: async (userData) => {
        const response = await api.post(
            "/admin/empleados-admins/create",
            userData,
        );
        return response.data;
    },

    // Actualizar empleado/admin
    update: async (id, userData) => {
        const response = await api.post(
            `/admin/empleados-admins/${id}/update`,
            userData,
        );
        return response.data;
    },

    // Eliminar empleado/admin
    delete: async (id) => {
        const response = await api.delete(
            `/admin/empleados-admins/${id}/delete`,
        );
        return response.data;
    },
};
