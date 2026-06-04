export const ORDER_TRACKING_STEPS = [
    { key: "PENDIENTE", label: "Pendiente" },
    { key: "EN_PROCESO", label: "En proceso" },
    { key: "LISTO_PARA_RECOJO", label: "Listo para recojo" },
    { key: "EN_CAMINO", label: "En camino" },
    { key: "ENTREGADO", label: "Entregado" },
];

export function getOrderStepIndex(estado) {
    const normalized = String(estado ?? "PENDIENTE").trim().toUpperCase();
    const idx = ORDER_TRACKING_STEPS.findIndex((s) => s.key === normalized);
    return idx >= 0 ? idx : 0;
}

export function getOrderStatusBadge(estado) {
    const normalized = String(estado ?? "").toUpperCase();
    if (normalized === "ENTREGADO") return "success";
    if (normalized === "EN_CAMINO" || normalized === "LISTO_PARA_RECOJO") {
        return "primary";
    }
    if (normalized === "EN_PROCESO") return "warning";
    return "secondary";
}

export function formatOrderStatusLabel(estado) {
    const step = ORDER_TRACKING_STEPS.find(
        (s) => s.key === String(estado ?? "").toUpperCase(),
    );
    return step?.label ?? estado ?? "Pendiente";
}
