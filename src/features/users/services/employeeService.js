import api from "../../../config/axios";

export const employeeService = {
    getAll: async () => {
        const response = await api.get("/admin/empleados");
        return response.data;
    },

    create: async (userData) => {
        const response = await api.post("/admin/empleados/create", userData);
        return response.data;
    },

    update: async (id, userData) => {
        const response = await api.post(
            `/admin/empleados/${id}/update`,
            userData,
        );
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/admin/empleados/${id}/delete`);
        return response.data;
    },
};
