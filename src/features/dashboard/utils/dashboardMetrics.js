const RECENT_SALES_DAYS = 5;

export const normalizeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.content)) return payload.content;
    return [];
};

export const getLocalDateKey = (date = new Date()) =>
    date.toLocaleDateString("en-CA");

export const getSaleDateKey = (fecha) => {
    if (!fecha) return null;
    return String(fecha).split("T")[0];
};

export const formatCurrency = (value) =>
    `S/ ${Number(value || 0).toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

export const formatNumber = (value) =>
    Number(value || 0).toLocaleString("es-PE");

export const buildRecentDays = (count = RECENT_SALES_DAYS) => {
    const days = [];
    for (let i = count - 1; i >= 0; i -= 1) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = getLocalDateKey(date);
        let label;
        if (i === 0) {
            label = "Hoy";
        } else if (i === 1) {
            label = "Ayer";
        } else {
            label = date.toLocaleDateString("es-PE", {
                day: "numeric",
                month: "short",
            });
        }
        days.push({ key, label });
    }
    return days;
};

export const roundChartAmount = (value) =>
    Math.round((Number(value) || 0) * 100) / 100;

/** Eje Y del gráfico: S/ 1000 sin decimales innecesarios */
export const formatChartYAxis = (value) => {
    const n = roundChartAmount(value);
    if (n === 0) return "0";
    return n.toLocaleString("es-PE", { maximumFractionDigits: 0 });
};

/** Etiqueta compacta sobre barras */
export const formatChartBarLabel = (value) => {
    const n = roundChartAmount(value);
    if (n <= 0) return "";
    if (n >= 1000) {
        return `S/ ${n.toLocaleString("es-PE", { maximumFractionDigits: 0 })}`;
    }
    return `S/ ${Number.isInteger(n) ? n : n.toFixed(2)}`;
};

export const computeDashboardMetrics = ({
    sales = [],
    products = [],
    clients = [],
}) => {
    const totalVentas = sales.length;
    const totalIngresos = sales.reduce(
        (sum, sale) => sum + (sale.total || 0),
        0,
    );
    const totalProductos = products.length;
    const totalClientes = clients.length;
    const todayKey = getLocalDateKey();

    const pedidosPendientes = sales.filter(
        (sale) => sale.estadoPedido === "PENDIENTE",
    ).length;

    const recentDays = buildRecentDays(RECENT_SALES_DAYS);

    const sumSalesForDay = (dayKey) =>
        roundChartAmount(
            sales
                .filter((sale) => getSaleDateKey(sale.fecha) === dayKey)
                .reduce((sum, sale) => sum + (sale.total || 0), 0),
        );

    const salesRecentAmounts = recentDays.map((day) => sumSalesForDay(day.key));
    const salesRecentTotal = roundChartAmount(
        salesRecentAmounts.reduce((sum, value) => sum + value, 0),
    );

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayKey = getLocalDateKey(yesterdayDate);

    const salesTodayAmount = sumSalesForDay(todayKey);
    const salesYesterdayAmount = sumSalesForDay(yesterdayKey);

    const categoryStockMap = {};
    products.forEach((product) => {
        const category = product.categoriaNombre || "Sin categoría";
        categoryStockMap[category] =
            (categoryStockMap[category] || 0) + (product.stock || 0);
    });
    const categoryLabels = Object.keys(categoryStockMap);
    const categorySeries = categoryLabels.map(
        (label) => categoryStockMap[label],
    );

    const criticalStock = products
        .filter((product) => (product.stock ?? 0) <= 10)
        .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
        .slice(0, 10);

    return {
        stats: [
            {
                label: "Total Ventas",
                value: formatNumber(totalVentas),
                icon: "bi-cart-check",
                color: "#198754",
            },
            {
                label: "Total Ingresos",
                value: formatCurrency(totalIngresos),
                icon: "bi-currency-dollar",
                color: "#0d6efd",
            },
            {
                label: "Productos",
                value: formatNumber(totalProductos),
                icon: "bi-box-seam",
                color: "#fd7e14",
            },
            {
                label: "Clientes",
                value: formatNumber(totalClientes),
                icon: "bi-people",
                color: "#6f42c1",
            },
        ],
        pedidosPendientes,
        salesRecentLabels: recentDays.map((day) => day.label),
        salesRecentAmounts,
        salesRecentTotal,
        salesTodayAmount,
        salesYesterdayAmount,
        salesDayChange:
            salesYesterdayAmount > 0
                ? Math.round(
                      ((salesTodayAmount - salesYesterdayAmount) /
                          salesYesterdayAmount) *
                          100,
                  )
                : salesTodayAmount > 0
                  ? 100
                  : 0,
        categoryLabels:
            categoryLabels.length > 0 ? categoryLabels : ["Sin datos"],
        categorySeries:
            categorySeries.length > 0 ? categorySeries : [0],
        criticalStock,
    };
};
