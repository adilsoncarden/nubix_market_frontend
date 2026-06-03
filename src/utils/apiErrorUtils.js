/**
 * Utilidades para errores HTTP del panel admin.
 */

export const FORBIDDEN_TOAST_MESSAGE =
    "Acción rechazada: Su usuario no cuenta con el permiso requerido para esta operación.";

export const isForbiddenError = (error) => error?.response?.status === 403;

export const getApiErrorMessage = (error, fallback = "Ocurrió un error al realizar la consulta.") => {
    const data = error?.response?.data;
    if (!data) return fallback;
    if (typeof data === "string") {
        const trimmed = data.trim();
        if (trimmed.startsWith("<")) return fallback;
        return trimmed;
    }
    if (typeof data.message === "string" && data.message.trim()) {
        return data.message.trim();
    }
    return fallback;
};

/**
 * Ejecuta una petición opcional; ante 403 devuelve fallback sin lanzar.
 */
export const fetchOptionalResource = async (requestFn, fallback = []) => {
    try {
        const result = await requestFn();
        return result ?? fallback;
    } catch (error) {
        if (isForbiddenError(error)) {
            console.warn(
                "[API] Recurso auxiliar omitido (403):",
                error.config?.url ?? "desconocido",
            );
            return fallback;
        }
        throw error;
    }
};
