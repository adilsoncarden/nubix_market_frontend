export const ORDER_PERIOD_OPTIONS = [
    { value: "month", label: "Este mes" },
    { value: "quarter", label: "Últimos 3 meses" },
    { value: "year", label: "Este año" },
    { value: "all", label: "Todo el historial" },
];

export function parseOrderDate(fecha) {
    if (!fecha) return null;
    const raw = String(fecha);
    const [y, m, d] = raw.split("T")[0].split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
}

const OPEN_ORDER_STATUSES = new Set([
    "PENDIENTE",
    "EN_PROCESO",
    "LISTO_PARA_RECOJO",
    "EN_CAMINO",
]);

export function isOrderOpen(estado) {
    const normalized = String(estado ?? "").trim().toUpperCase();
    if (!normalized) return false;
    return OPEN_ORDER_STATUSES.has(normalized);
}

/** Parámetro `mes` para GET /api/ventas/mis-pedidos */
export function periodToApiParam(period = "month") {
    switch (period) {
        case "quarter":
            return "trimestre";
        case "year":
            return "anio";
        case "all":
            return "todos";
        case "month":
        default:
            return "actual";
    }
}

export function filterOrdersByPeriod(orders, period = "month") {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return orders.filter((order) => {
        const date = parseOrderDate(order.fecha);
        if (!date) return period === "all";

        switch (period) {
            case "month":
                return (
                    date.getFullYear() === currentYear &&
                    date.getMonth() === currentMonth
                );
            case "quarter": {
                const threeMonthsAgo = new Date(
                    currentYear,
                    currentMonth - 2,
                    1,
                );
                return date >= threeMonthsAgo;
            }
            case "year":
                return date.getFullYear() === currentYear;
            case "all":
            default:
                return true;
        }
    });
}
