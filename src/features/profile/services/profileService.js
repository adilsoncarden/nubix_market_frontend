import api from "../../../config/axios";

export const profileService = {
    getPerfil: async () => {
        const response = await api.get("/usuarios/perfil");
        return response.data;
    },

    updatePerfil: async (payload) => {
        const response = await api.put("/usuarios/perfil", payload);
        return response.data;
    },
};
