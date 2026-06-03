import api from "../../../config/axios";

export const securityService = {
    getPermisos: async (modulo) => {
        const params = modulo ? { modulo } : {};
        const response = await api.get("/permisos", { params });
        return Array.isArray(response.data) ? response.data : [];
    },

    getPermisoModulos: async () => {
        const response = await api.get("/permisos/modulos");
        return Array.isArray(response.data) ? response.data : [];
    },

    getPermiso: async (id) => {
        const response = await api.get(`/permisos/${id}`);
        return response.data;
    },

    createPermiso: async (data) => {
        const response = await api.post("/permisos", data);
        return response.data;
    },

    updatePermiso: async (id, data) => {
        const response = await api.put(`/permisos/${id}`, data);
        return response.data;
    },

    deletePermiso: async (id) => {
        await api.delete(`/permisos/${id}`);
    },

    getRoles: async () => {
        const response = await api.get("/roles");
        return Array.isArray(response.data) ? response.data : [];
    },

    getRol: async (id) => {
        const response = await api.get(`/roles/${id}`);
        return response.data;
    },

    createRol: async (data) => {
        const response = await api.post("/roles", data);
        return response.data;
    },

    updateRol: async (id, data) => {
        const response = await api.put(`/roles/${id}`, data);
        return response.data;
    },

    deleteRol: async (id) => {
        await api.delete(`/roles/${id}`);
    },

    getRolPermisoIds: async (rolId) => {
        const response = await api.get(`/roles/${rolId}/permisos`);
        return response.data?.permisoIds ?? [];
    },

    syncRolPermisos: async (rolId, permisoIds) => {
        const response = await api.post(`/roles/${rolId}/permisos`, {
            permisoIds,
        });
        return response.data?.permisoIds ?? [];
    },
};
