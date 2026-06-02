import { getSaleClientLabel } from "../services/saleService";

export const TIPO_ENTREGA_OPTIONS = [
    { value: "", label: "Todos los tipos" },
    { value: "PRESENCIAL", label: "Presencial" },
    { value: "FAST_LANE", label: "Fast Lane" },
    { value: "DELIVERY", label: "Delivery" },
];

export const TIPO_ENTREGA_LABELS = {
    PRESENCIAL: "Presencial",
    FAST_LANE: "Fast Lane",
    DELIVERY: "Delivery",
};

export const saleDateKey = (sale) => {
    const raw = sale?.pago?.fechaPago || sale?.fecha;
    if (!raw) return null;
    return String(raw).split("T")[0];
};

export const matchesSaleDateRange = (sale, desde, hasta) => {
    const key = saleDateKey(sale);
    if (!key) return !desde && !hasta;
    if (desde && key < desde) return false;
    if (hasta && key > hasta) return false;
    return true;
};

export const matchesSaleFilters = (
    sale,
    { tipoEntrega, clienteId, desde, hasta },
) => {
    if (tipoEntrega && sale.tipoEntrega !== tipoEntrega) return false;
    if (clienteId) {
        const cid = Number(clienteId);
        if (!sale.cliente?.id || sale.cliente.id !== cid) return false;
    }
    if (!matchesSaleDateRange(sale, desde, hasta)) return false;
    return true;
};

export const matchesSaleSearch = (sale, searchTerm) => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return true;

    const entregaLabel = TIPO_ENTREGA_LABELS[sale.tipoEntrega] || "";
    const haystack = [
        String(sale.id ?? ""),
        getSaleClientLabel(sale),
        sale.cliente?.username,
        sale.cliente?.email,
        sale.nombreComprobante,
        sale.razonSocial,
        sale.dni,
        sale.ruc,
        sale.tipoEntrega,
        entregaLabel,
        sale.estadoPedido,
        sale.estadoPago,
        sale.metodoPago,
        sale.codigoRecojo,
        sale.vendedor?.username,
    ];

    return haystack.some(
        (part) => part && String(part).toLowerCase().includes(q),
    );
};

export const filterSales = (sales, { searchTerm, tipoEntrega, clienteId, desde, hasta }) =>
    sales.filter(
        (sale) =>
            matchesSaleSearch(sale, searchTerm) &&
            matchesSaleFilters(sale, { tipoEntrega, clienteId, desde, hasta }),
    );
