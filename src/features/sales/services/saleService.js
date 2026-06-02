import api from "../../../config/axios";
import { unwrapApiList } from "../../../config/apiUtils";

export const saleService = {
    getAll: async () => {
        const response = await api.get("/admin/ventas");
        return unwrapApiList(response.data);
    },

    getById: async (id) => {
        const response = await api.get(`/admin/ventas/${id}`);
        return response.data;
    },

    create: async (saleData) => {
        const response = await api.post("/admin/ventas/create", saleData);
        return response.data;
    },

    checkout: async (checkoutData) => {
        const response = await api.post("/ventas/checkout", checkoutData);
        return response.data;
    },

    updateStatus: async (id, estado) => {
        const response = await api.post(`/admin/ventas/${id}`, null, {
            params: { estado },
        });
        return response.data;
    },

    registerCredit: async (id) => {
        const response = await api.post(`/admin/ventas/${id}/credito`);
        return response.data;
    },
};

export const parseSaleDate = (fecha) => {
    if (!fecha) return null;
    const raw = String(fecha);
    if (raw.includes("T") && raw.length > 10) {
        const parsed = new Date(raw);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    const [year, month, day] = raw.split("T")[0].split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
};

export const formatSaleDateTime = (sale) => {
    const raw = sale?.pago?.fechaPago || sale?.fecha;
    if (!raw) return "-";

    if (String(raw).includes("T") && String(raw).length > 10) {
        const parsed = new Date(raw);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed.toLocaleString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        }
    }

    const parsed = parseSaleDate(raw);
    if (!parsed) return "-";
    return parsed.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export const getSaleVendorLabel = (sale) => {
    if (!sale) return "-";
    if (sale.canal === "WEB") return "WEB";
    return sale.vendedor?.username || "-";
};

export const getSaleClientLabel = (sale) => {
    if (!sale) return "-";

    if (sale.tipoComprobante === "TICKET") {
        return "Consumidor Final";
    }

    if (sale.tipoComprobante === "BOLETA") {
        if (sale.cliente?.username) return sale.cliente.username;
        if (sale.nombreComprobante) return sale.nombreComprobante;
        if (sale.dni) return `DNI ${sale.dni}`;
        return "Consumidor Final";
    }

    if (sale.tipoComprobante === "FACTURA") {
        if (sale.razonSocial) return sale.razonSocial;
        if (sale.ruc) return `RUC ${sale.ruc}`;
        if (sale.cliente?.username) return sale.cliente.username;
        return "Consumidor Final";
    }

    return (
        sale.cliente?.username ||
        sale.nombreComprobante ||
        sale.razonSocial ||
        "Consumidor Final"
    );
};
