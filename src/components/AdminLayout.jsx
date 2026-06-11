import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../store/AuthContext";
import { useTheme } from "../store/ThemeContext";
import Chart from "react-apexcharts";
import { saleService } from "../features/sales/services/saleService";
import { productService } from "../features/products/services/productService";
import { clientService } from "../features/users/services/clientService";
import {
    computeDashboardMetrics,
    formatChartBarLabel,
    formatChartYAxis,
    formatCurrency,
    normalizeList,
} from "../features/dashboard/utils/dashboardMetrics";
import "../styles/admin.css";
import AdminResponsiveTable from "./admin/AdminResponsiveTable";

const AdminLayout = () => {
    const { adminSessionUser } = useAuth();
    const user = adminSessionUser;
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [now, setNow] = useState(() => new Date());
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [rawData, setRawData] = useState({
        sales: [],
        products: [],
        clients: [],
    });

    const isDashboardHome =
        location.pathname === "/admin" ||
        location.pathname === "/admin/" ||
        location.pathname.endsWith("/dashboard");

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!isDashboardHome) return;

        let cancelled = false;

        const fetchDashboardData = async () => {
            setDashboardLoading(true);
            try {
                const [sales, products, clients] = await Promise.all([
                    saleService.getAll(),
                    productService.getAll(),
                    clientService.getAll(),
                ]);

                if (!cancelled) {
                    setRawData({
                        sales: normalizeList(sales),
                        products: normalizeList(products),
                        clients: normalizeList(clients),
                    });
                }
            } catch (err) {
                console.error("[Dashboard] Error al cargar datos:", err);
            } finally {
                if (!cancelled) {
                    setDashboardLoading(false);
                }
            }
        };

        fetchDashboardData();
        return () => {
            cancelled = true;
        };
    }, [isDashboardHome]);

    const metrics = useMemo(() => computeDashboardMetrics(rawData), [rawData]);

    const chartTheme = useMemo(
        () => ({
            foreColor: theme === "dark" ? "#94a3b8" : "#64748b",
            gridColor: theme === "dark" ? "#334155" : "#e2e8f0",
            labelColor: theme === "dark" ? "#e2e8f0" : "#334155",
        }),
        [theme],
    );

    const salesBarOptions = useMemo(
        () => ({
            chart: {
                id: "sales-bar-chart",
                toolbar: { show: false },
                fontFamily: "inherit",
            },
            colors: [theme === "dark" ? "#34d399" : "#198754"],
            plotOptions: {
                bar: {
                    borderRadius: 8,
                    borderRadiusApplication: "end",
                    columnWidth: "48%",
                    dataLabels: { position: "top" },
                },
            },
            dataLabels: {
                enabled: true,
                formatter: (val) => formatChartBarLabel(val),
                offsetY: -6,
                style: {
                    fontSize: "11px",
                    fontWeight: 600,
                    colors: [chartTheme.labelColor],
                },
            },
            xaxis: {
                categories: metrics.salesRecentLabels,
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: {
                    style: {
                        colors: chartTheme.foreColor,
                        fontSize: "12px",
                        fontWeight: 600,
                    },
                },
            },
            yaxis: {
                min: 0,
                tickAmount: 4,
                labels: {
                    formatter: (val) => `S/ ${formatChartYAxis(val)}`,
                    style: { colors: chartTheme.foreColor },
                },
            },
            grid: {
                borderColor: chartTheme.gridColor,
                strokeDashArray: 4,
                padding: { top: 8, right: 8, left: 4, bottom: 0 },
            },
            tooltip: {
                theme,
                y: {
                    formatter: (val) => formatCurrency(val),
                },
            },
        }),
        [
            metrics.salesRecentLabels,
            chartTheme.foreColor,
            chartTheme.gridColor,
            chartTheme.labelColor,
            theme,
        ],
    );

    const salesBarSeries = useMemo(
        () => [{ name: "Ingresos", data: metrics.salesRecentAmounts }],
        [metrics.salesRecentAmounts],
    );

    const categoryOptions = useMemo(
        () => ({
            labels: metrics.categoryLabels,
            colors: ["#198754", "#0d6efd", "#fd7e14", "#dc3545", "#6c757d"],
            legend: {
                position: "bottom",
                labels: { colors: chartTheme.foreColor },
            },
            plotOptions: { pie: { donut: { size: "65%" } } },
            tooltip: { theme },
        }),
        [metrics.categoryLabels, chartTheme.foreColor, theme],
    );

    const categorySeries = metrics.categorySeries;

    return (
        <div
            className="d-flex vh-100 overflow-hidden bg-body-secondary admin-shell"
            data-bs-theme={theme}
        >
            <button
                type="button"
                className={`admin-sidebar-backdrop ${sidebarOpen ? "is-visible" : ""}`}
                aria-label="Cerrar menú"
                onClick={() => setSidebarOpen(false)}
            />
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-grow-1 d-flex flex-column overflow-hidden min-w-0">
                <header className="navbar border-bottom px-4 py-3 bg-body shadow-sm sticky-top admin-topbar">
                    <div className="container-fluid p-0 d-flex align-items-center flex-wrap gap-2 gap-md-3">
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm admin-menu-toggle me-1"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Abrir menú"
                        >
                            <i className="bi bi-list fs-5"></i>
                        </button>
                        <h5 className="m-0 fw-bold text-secondary">
                            Dashboard Operativo
                        </h5>

                        <div className="d-flex align-items-center flex-wrap gap-3 ms-md-3 admin-topbar-stats">
                            <div className="small">
                                <div
                                    className="fw-bold"
                                    style={{ color: "#198754" }}
                                >
                                    {now.toLocaleTimeString("es-PE")}
                                </div>
                                <div className="text-muted">
                                    {now.toLocaleDateString("es-PE", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-center ms-auto gap-3">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                                onClick={toggleTheme}
                                title={
                                    theme === "light"
                                        ? "Activar modo oscuro"
                                        : "Activar modo claro"
                                }
                            >
                                <i
                                    className={`bi ${theme === "light" ? "bi-moon-stars" : "bi-sun"} me-1`}
                                ></i>
                                {theme === "light" ? "Oscuro" : "Claro"}
                            </button>
                            <span className="fw-bold small text-muted admin-session-label">
                                Sesión:{" "}
                                <span className="text-emerald-600">
                                    {user?.username}
                                </span>
                            </span>
                            <div
                                className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                                style={{
                                    width: "38px",
                                    height: "38px",
                                    backgroundColor: "#198754",
                                }}
                            >
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 flex-grow-1 overflow-auto">
                    <div className="container-fluid px-0">
                        {isDashboardHome ? (
                            <div className="animate__animated animate__fadeIn">
                                <div className="row g-4 mb-4 admin-dashboard-metrics">
                                    {metrics.stats.map((stat, i) => (
                                        <div
                                            className="col-12 col-md-6 col-lg-3"
                                            key={stat.label}
                                        >
                                            <div className="card card-dashboard p-3 shadow-sm h-100">
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="icon-box me-3 shadow-sm"
                                                        style={{
                                                            backgroundColor: `${stat.color}15`,
                                                            color: stat.color,
                                                        }}
                                                    >
                                                        <i
                                                            className={`bi ${stat.icon} fs-4`}
                                                        ></i>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted small mb-0 fw-bold">
                                                            {stat.label}
                                                        </p>
                                                        <div className="stat-value">
                                                            {dashboardLoading
                                                                ? "..."
                                                                : stat.value}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="row g-4 mb-4 admin-dashboard-charts">
                                    <div className="col-12">
                                        <div className="card card-dashboard p-4 shadow-sm h-100">
                                            <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-3">
                                                <div>
                                                    <h6 className="chart-title mb-1">
                                                        Ventas recientes
                                                    </h6>
                                                    <p className="text-muted small mb-0">
                                                        Ingresos de los últimos 5
                                                        días
                                                    </p>
                                                </div>
                                                {metrics.salesDayChange !== 0 && (
                                                    <span
                                                        className={`badge rounded-pill dashboard-sales-change ${
                                                            metrics.salesDayChange >=
                                                            0
                                                                ? "dashboard-sales-change--up"
                                                                : "dashboard-sales-change--down"
                                                        }`}
                                                    >
                                                        {metrics.salesDayChange >=
                                                        0
                                                            ? "+"
                                                            : ""}
                                                        {metrics.salesDayChange}%
                                                        vs ayer
                                                    </span>
                                                )}
                                            </div>
                                            <div className="dashboard-sales-kpis mb-3">
                                                <div className="dashboard-sales-kpi">
                                                    <span className="dashboard-sales-kpi-label">
                                                        Hoy
                                                    </span>
                                                    <strong className="dashboard-sales-kpi-value">
                                                        {formatCurrency(
                                                            metrics.salesTodayAmount,
                                                        )}
                                                    </strong>
                                                </div>
                                                <div className="dashboard-sales-kpi">
                                                    <span className="dashboard-sales-kpi-label">
                                                        5 días
                                                    </span>
                                                    <strong className="dashboard-sales-kpi-value">
                                                        {formatCurrency(
                                                            metrics.salesRecentTotal,
                                                        )}
                                                    </strong>
                                                </div>
                                                <div className="dashboard-sales-kpi">
                                                    <span className="dashboard-sales-kpi-label">
                                                        Pendientes
                                                    </span>
                                                    <strong className="dashboard-sales-kpi-value">
                                                        {metrics.pedidosPendientes}
                                                    </strong>
                                                </div>
                                            </div>
                                            <Chart
                                                options={salesBarOptions}
                                                series={salesBarSeries}
                                                type="bar"
                                                height={280}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-4 mb-4 admin-dashboard-charts">
                                    <div className="col-12 col-lg-6 col-xl-5">
                                        <div className="card card-dashboard p-4 shadow-sm h-100">
                                            <h6 className="chart-title mb-1">
                                                Stock por Categoría
                                            </h6>
                                            <p className="text-muted small mb-3">
                                                Distribución actual del inventario
                                            </p>
                                            <Chart
                                                options={categoryOptions}
                                                series={categorySeries}
                                                type="donut"
                                                height={300}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-4">
                                    <div className="col-12">
                                        <div className="card card-dashboard card-dashboard-critical p-4 shadow-sm">
                                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                                                <div>
                                                    <h6 className="chart-title mb-1">
                                                        Alerta de Inventario Crítico
                                                    </h6>
                                                    <p className="text-muted small mb-0">
                                                        Productos con stock ≤ 10 unidades
                                                    </p>
                                                </div>
                                                {!dashboardLoading && (
                                                    <span className="badge dashboard-critical-count rounded-pill">
                                                        {metrics.criticalStock.length}{" "}
                                                        {metrics.criticalStock.length === 1
                                                            ? "producto"
                                                            : "productos"}
                                                    </span>
                                                )}
                                            </div>
                                            <AdminResponsiveTable>
                                                <table className="table table-custom align-middle">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-muted small">
                                                                PRODUCTO
                                                            </th>
                                                            <th className="text-muted small">
                                                                CATEGORÍA
                                                            </th>
                                                            <th className="text-muted small">
                                                                STOCK
                                                            </th>
                                                            <th className="text-muted small">
                                                                ESTADO
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dashboardLoading ? (
                                                            <tr>
                                                                <td
                                                                    colSpan="4"
                                                                    className="text-center text-muted py-4"
                                                                >
                                                                    Cargando
                                                                    inventario...
                                                                </td>
                                                            </tr>
                                                        ) : metrics
                                                              .criticalStock
                                                              .length === 0 ? (
                                                            <tr>
                                                                <td
                                                                    colSpan="4"
                                                                    className="text-center text-muted py-4"
                                                                >
                                                                    No hay
                                                                    productos
                                                                    con stock
                                                                    crítico.
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            metrics.criticalStock.map(
                                                                (product) => (
                                                                    <tr
                                                                        key={
                                                                            product.id
                                                                        }
                                                                    >
                                                                        <td className="fw-bold">
                                                                            {
                                                                                product.nombre
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {product.categoriaNombre ||
                                                                                "Sin categoría"}
                                                                        </td>
                                                                        <td className="text-danger fw-bold">
                                                                            {product.stock ??
                                                                                0}{" "}
                                                                            u.
                                                                        </td>
                                                                        <td>
                                                                            <span className="badge badge-critical">
                                                                                {(product.stock ??
                                                                                    0) ===
                                                                                0
                                                                                    ? "Sin Stock"
                                                                                    : "Reordenar Ya"}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ),
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </AdminResponsiveTable>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Outlet />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
