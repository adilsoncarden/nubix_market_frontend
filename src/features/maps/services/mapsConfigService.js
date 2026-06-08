import api from "../../../config/axios";

export const GOOGLE_MAPS_API_KEY_PLACEHOLDER = "TU_GOOGLE_MAPS_API_KEY_AQUI";

const isUsableKey = (key) =>
    Boolean(key?.trim()) && key.trim() !== GOOGLE_MAPS_API_KEY_PLACEHOLDER;

export const mapsConfigService = {
    /**
     * Obtiene la API Key desde el backend (fuente principal).
     * Si falla o no está configurada, intenta VITE_GOOGLE_MAPS_API_KEY como respaldo local.
     */
    getGoogleMapsApiKey: async () => {
        try {
            const { data } = await api.get("/config/google-maps-key");
            if (data?.configured && isUsableKey(data.apiKey)) {
                return { apiKey: data.apiKey.trim(), source: "backend" };
            }
        } catch {
            /* continuar con fallback */
        }

        const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();
        if (isUsableKey(envKey)) {
            return { apiKey: envKey, source: "env" };
        }

        return { apiKey: "", source: "none", configured: false };
    },
};
