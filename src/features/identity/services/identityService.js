import api from "../../../config/axios";

export const identityService = {
    consultar: async (documento) => {
        const numero = String(documento).replace(/\D/g, "");
        const { data } = await api.get(`/identidad/consultar/${numero}`);
        return data;
    },
};
