export const ORDER_STATUS_LABELS = {
    PENDIENTE: "Pendiente",
    EN_PROCESO: "En proceso",
    LISTO_PARA_RECOJO: "Listo para recojo",
    EN_CAMINO: "En camino",
    ENTREGADO: "Entregado",
};

const FLOW_BY_TIPO_ENTREGA = {
    FAST_LANE: [
        "PENDIENTE",
        "EN_PROCESO",
        "LISTO_PARA_RECOJO",
        "ENTREGADO",
    ],
    DELIVERY: ["PENDIENTE", "EN_PROCESO", "EN_CAMINO", "ENTREGADO"],
    PRESENCIAL: ["PENDIENTE", "EN_PROCESO", "ENTREGADO"],
};

export const ORDER_TRACKING_STEPS = Object.entries(ORDER_STATUS_LABELS).map(
    ([key, label]) => ({ key, label }),
);

function normalizeStatus(estado) {
    return String(estado ?? "PENDIENTE").trim().toUpperCase();
}

function normalizeTipoEntrega(tipoEntrega) {
    const tipo = String(tipoEntrega ?? "DELIVERY").trim().toUpperCase();
    return FLOW_BY_TIPO_ENTREGA[tipo] ? tipo : "DELIVERY";
}

export function getOrderFlowSteps(tipoEntrega) {
    const flow = FLOW_BY_TIPO_ENTREGA[normalizeTipoEntrega(tipoEntrega)];
    return flow.map((key) => ({
        key,
        label: ORDER_STATUS_LABELS[key] ?? key,
    }));
}

export function getOrderStepIndex(estado, tipoEntrega) {
    const normalized = normalizeStatus(estado);
    const steps = getOrderFlowSteps(tipoEntrega);
    return steps.findIndex((s) => s.key === normalized);
}

export function isOrderStatusInFlow(estado, tipoEntrega) {
    return getOrderStepIndex(estado, tipoEntrega) >= 0;
}

export function isOrderStatusFinal(estado) {
    return normalizeStatus(estado) === "ENTREGADO";
}

export function canSelectOrderStatus(currentEstado, targetEstado, tipoEntrega) {
    const current = normalizeStatus(currentEstado);
    const target = normalizeStatus(targetEstado);

    if (current === "ENTREGADO") {
        return target === "ENTREGADO";
    }

    const steps = getOrderFlowSteps(tipoEntrega);
    const currentIndex = steps.findIndex((s) => s.key === current);
    const targetIndex = steps.findIndex((s) => s.key === target);

    if (currentIndex < 0 || targetIndex < 0) {
        return false;
    }

    return targetIndex >= currentIndex;
}

export function getOrderStatusBadge(estado) {
    const normalized = normalizeStatus(estado);
    if (normalized === "ENTREGADO") return "success";
    if (normalized === "EN_CAMINO" || normalized === "LISTO_PARA_RECOJO") {
        return "primary";
    }
    if (normalized === "EN_PROCESO") return "warning";
    return "secondary";
}

export function formatOrderStatusLabel(estado) {
    return ORDER_STATUS_LABELS[normalizeStatus(estado)] ?? estado ?? "Pendiente";
}
