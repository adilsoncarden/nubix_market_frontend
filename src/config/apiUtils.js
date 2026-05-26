/**
 * Normaliza respuestas de listas del API (array directo o envoltorios comunes).
 */
export function unwrapApiList(payload) {
    if (Array.isArray(payload)) {
        return payload;
    }
    if (!payload || typeof payload !== "object") {
        return [];
    }
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.products)) return payload.products;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.content)) return payload.content;
    console.warn("[API] Formato de lista no reconocido:", payload);
    return [];
}
