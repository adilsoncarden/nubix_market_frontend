const HEATMAP_DAYS = ["Lun", "Mié", "Vie"];
const HOUR_BUCKETS = ["08am", "10am", "12pm", "02pm", "04pm", "06pm", "08pm"];

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

const getWeekdayIndex = (fecha) => {
    const key = getSaleDateKey(fecha);
    if (!key) return null;
    const date = new Date(`${key}T12:00:00`);
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
};

export const buildLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i -= 1) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push({
            key: getLocalDateKey(date),
            label: date.toLocaleDateString("es-PE", { weekday: "short" }),
        });
    }
    return days;
};

export const computeDashboardMetrics = ({
    sales = [],
    products = [],
    clients = [],
    suppliers = [],
}) => {
    const totalVentas = sales.length;
    const totalIngresos = sales.reduce(
        (sum, sale) => sum + (sale.total || 0),
        0,
    );
    const totalProductos = products.length;
    const totalClientes = clients.length;

    const todayKey = getLocalDateKey();
    const ventasHoy = sales.filter(
        (sale) => getSaleDateKey(sale.fecha) === todayKey,
    ).length;
    const pedidosPendientes = sales.filter(
        (sale) => sale.estadoPedido === "PENDIENTE",
    ).length;

    const last7Days = buildLast7Days();
    const salesTrend = last7Days.map((day) =>
        sales
            .filter((sale) => getSaleDateKey(sale.fecha) === day.key)
            .reduce((sum, sale) => sum + (sale.total || 0), 0),
    );

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

    const topSuppliers = [...suppliers]
        .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""))
        .slice(0, 5);
    const supplierLabels = topSuppliers.map(
        (supplier) => supplier.nombre || "Proveedor",
    );
    const supplierSeries = topSuppliers.map(() => 1);

    const deliveredCount = sales.filter(
        (sale) => sale.estadoPedido === "ENTREGADO",
    ).length;
    const approvedPayments = sales.filter(
        (sale) => sale.estadoPago === "APROBADO",
    ).length;
    const sellerCount = new Set(
        sales.map((sale) => sale.vendedor?.username).filter(Boolean),
    ).size;

    const employeeSeries = [
        Math.min(100, sellerCount * 15),
        Math.min(
            100,
            Math.round((totalIngresos / Math.max(totalVentas, 1)) * 2),
        ),
        Math.min(100, Math.round((totalVentas / Math.max(sellerCount, 1)) * 8)),
        Math.min(
            100,
            Math.round((deliveredCount / Math.max(totalVentas, 1)) * 100),
        ),
        Math.min(
            100,
            Math.round((approvedPayments / Math.max(totalVentas, 1)) * 100),
        ),
    ];

    const heatMapSeries = HEATMAP_DAYS.map((dayLabel, rowIndex) => ({
        name: dayLabel,
        data: HOUR_BUCKETS.map((_, hourIndex) => {
            if (hourIndex !== 2) return 0;
            const weekdayIndex = rowIndex * 2;
            return sales.filter(
                (sale) => getWeekdayIndex(sale.fecha) === weekdayIndex,
            ).length;
        }),
    }));

    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthSales = sales
        .filter((sale) => getSaleDateKey(sale.fecha)?.startsWith(monthPrefix))
        .reduce((sum, sale) => sum + (sale.total || 0), 0);
    const dailyAverage =
        salesTrend.reduce((sum, value) => sum + value, 0) /
        Math.max(last7Days.length, 1);
    const monthlyTarget = Math.max(dailyAverage * 30, monthSales, 1);
    const goalPercent = Math.min(
        100,
        Math.round((monthSales / monthlyTarget) * 100),
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
        ventasHoy,
        pedidosPendientes,
        salesTrendLabels: last7Days.map((day) => day.label),
        salesTrend,
        categoryLabels:
            categoryLabels.length > 0 ? categoryLabels : ["Sin datos"],
        categorySeries:
            categorySeries.length > 0 ? categorySeries : [0],
        supplierLabels:
            supplierLabels.length > 0 ? supplierLabels : ["Sin proveedores"],
        supplierSeries:
            supplierSeries.length > 0 ? supplierSeries : [0],
        employeeSeries,
        heatMapSeries,
        goalPercent,
        goalRemaining: Math.max(0, 100 - goalPercent),
        criticalStock,
    };
};
