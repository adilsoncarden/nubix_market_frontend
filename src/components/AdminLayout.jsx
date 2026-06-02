import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../store/AuthContext";
import { useTheme } from "../store/ThemeContext";
import Chart from "react-apexcharts";
import { saleService } from "../features/sales/services/saleService";
import { productService } from "../features/products/services/productService";
import { clientService } from "../features/users/services/clientService";
import { employeeService } from "../features/users/services/employeeService";
import { getSuppliers } from "../features/suppliers/services/supplierService";
import {
    computeDashboardMetrics,
    normalizeList,
} from "../features/dashboard/utils/dashboardMetrics";

const AdminLayout = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [now, setNow] = useState(() => new Date());
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [rawData, setRawData] = useState({
        sales: [],
        products: [],
        clients: [],
        employees: [],
        suppliers: [],
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
        if (!isDashboardHome) return;

        let cancelled = false;

        const fetchDashboardData = async () => {
            setDashboardLoading(true);
            try {
                const [sales, products, clients, employees, suppliers] =
                    await Promise.all([
                        saleService.getAll(),
                        productService.getAll(),
                        clientService.getAll(),
                        employeeService.getAll(),
                        getSuppliers(),
                    ]);

                if (!cancelled) {
                    setRawData({
                        sales: normalizeList(sales),
                        products: normalizeList(products),
                        clients: normalizeList(clients),
                        employees: normalizeList(employees),
                        suppliers: normalizeList(suppliers),
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
            goalLabelColor: theme === "dark" ? "#94a3b8" : "#64748b",
            goalValueColor: theme === "dark" ? "#f8fafc" : "#1e293b",
        }),
        [theme],
    );

    const salesOptions = useMemo(
        () => ({
            chart: { id: "sales-chart", toolbar: { show: false } },
            colors: ["#198754"],
            stroke: { curve: "smooth", width: 3 },
            xaxis: {
                categories: metrics.salesTrendLabels,
                labels: { style: { colors: chartTheme.foreColor } },
            },
            yaxis: {
                labels: { style: { colors: chartTheme.foreColor } },
            },
            grid: { borderColor: chartTheme.gridColor },
            tooltip: { theme },
        }),
        [metrics.salesTrendLabels, chartTheme, theme],
    );

    const salesSeries = useMemo(
        () => [{ name: "Ventas", data: metrics.salesTrend }],
        [metrics.salesTrend],
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

    const employeeOptions = useMemo(
        () => ({
            chart: { toolbar: { show: false } },
            xaxis: {
                categories: [
                    "Equipo",
                    "Ticket",
                    "Pedidos",
                    "Entregas",
                    "Pagos",
                ],
                labels: { style: { colors: chartTheme.foreColor } },
            },
            yaxis: {
                show: false,
                max: 100,
            },
            colors: ["#6f42c1"],
            fill: { opacity: 0.4 },
            tooltip: { theme },
        }),
        [chartTheme.foreColor, theme],
    );

    const employeeSeries = useMemo(
        () => [{ name: "Indicadores", data: metrics.employeeSeries }],
        [metrics.employeeSeries],
    );

    const supplierOptions = useMemo(
        () => ({
            plotOptions: { bar: { borderRadius: 4, horizontal: true } },
            colors: ["#20c997"],
            xaxis: {
                categories: metrics.supplierLabels,
                labels: { style: { colors: chartTheme.foreColor } },
            },
            yaxis: {
                labels: { style: { colors: chartTheme.foreColor } },
            },
            grid: { borderColor: chartTheme.gridColor },
            tooltip: { theme },
        }),
        [metrics.supplierLabels, chartTheme, theme],
    );

    const supplierSeries = useMemo(
        () => [{ name: "Registrados", data: metrics.supplierSeries }],
        [metrics.supplierSeries],
    );

    const heatMapOptions = useMemo(
        () => ({
            chart: { toolbar: { show: false } },
            dataLabels: { enabled: false },
            colors: ["#198754"],
            xaxis: {
                categories: [
                    "08am",
                    "10am",
                    "12pm",
                    "02pm",
                    "04pm",
                    "06pm",
                    "08pm",
                ],
                labels: { style: { colors: chartTheme.foreColor } },
            },
            yaxis: {
                labels: { style: { colors: chartTheme.foreColor } },
            },
            tooltip: { theme },
        }),
        [chartTheme.foreColor, theme],
    );

    const goalOptions = useMemo(
        () => ({
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 135,
                    dataLabels: {
                        name: {
                            fontSize: "14px",
                            color: chartTheme.goalLabelColor,
                            offsetY: 100,
                        },
                        value: {
                            offsetY: 60,
                            fontSize: "22px",
                            color: chartTheme.goalValueColor,
                            formatter: (val) => val + "%",
                        },
                    },
                },
            },
            fill: { colors: ["#198754"] },
            labels: ["Meta Mensual"],
            tooltip: { theme },
        }),
        [chartTheme, theme],
    );

    return (
        <div
            className="d-flex vh-100 overflow-hidden bg-body-secondary admin-shell"
            data-bs-theme={theme}
        >
            <Sidebar />

            <div className="flex-grow-1 d-flex flex-column overflow-hidden">
                <header className="navbar border-bottom px-4 py-3 bg-body shadow-sm sticky-top">
                    <div className="container-fluid p-0 d-flex align-items-center flex-wrap gap-3">
                        <h5 className="m-0 fw-bold text-secondary">
                            Dashboard Operativo
                        </h5>

                        <div className="d-flex align-items-center flex-wrap gap-3 ms-md-3">
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
                            <div className="vr d-none d-md-block opacity-25" />
                            <div className="small text-muted">
                                Ventas hoy:{" "}
                                <span className="fw-bold text-body">
                                    {dashboardLoading
                                        ? "..."
                                        : metrics.ventasHoy}
                                </span>
                            </div>
                            <div className="small text-muted">
                                Pendientes:{" "}
                                <span className="fw-bold text-body">
                                    {dashboardLoading
                                        ? "..."
                                        : metrics.pedidosPendientes}
                                </span>
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
                            <span className="fw-bold small text-muted">
                                Sesión:{" "}
                                <span style={{ color: "#198754" }}>
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
                    <div className="container-fluid">
                        <style>{`
                            .card-dashboard { border-radius: 18px; border: none; background: var(--bs-body-bg); }
                            .icon-box { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                            .stat-value { font-size: 1.75rem; font-weight: 800; color: var(--bs-body-color); }
                            .chart-title { font-size: 0.85rem; font-weight: 700; color: var(--bs-secondary-color); text-transform: uppercase; letter-spacing: 0.5px; }
                            .table-custom thead { background-color: var(--bs-tertiary-bg); }
                            .badge-critical { background-color: #fee2e2; color: #991b1b; border: 1px solid #f87171; }
                            [data-bs-theme="dark"] .badge-critical { background-color: rgba(153, 27, 27, 0.25); color: #fca5a5; border-color: #991b1b; }
                            .admin-shell[data-bs-theme="dark"] .bg-white,
                            .admin-shell[data-bs-theme="dark"] .card.border-0.shadow-sm {
                                background-color: var(--bs-body-bg) !important;
                                color: var(--bs-body-color);
                            }
                            .admin-shell[data-bs-theme="dark"] .bg-light,
                            .admin-shell[data-bs-theme="dark"] .table-light,
                            .admin-shell[data-bs-theme="dark"] thead.bg-light {
                                background-color: var(--bs-tertiary-bg) !important;
                                color: var(--bs-body-color) !important;
                            }
                            .admin-shell[data-bs-theme="dark"] .text-dark {
                                color: var(--bs-body-color) !important;
                            }
                            .admin-shell[data-bs-theme="dark"] .form-control.bg-light,
                            .admin-shell[data-bs-theme="dark"] .form-select.bg-light,
                            .admin-shell[data-bs-theme="dark"] .input-group-text.bg-light {
                                background-color: var(--bs-secondary-bg) !important;
                                color: var(--bs-body-color) !important;
                                border-color: var(--bs-border-color) !important;
                            }
                            .admin-shell[data-bs-theme="dark"] .page-link.text-dark.bg-light {
                                background-color: var(--bs-secondary-bg) !important;
                                color: var(--bs-body-color) !important;
                            }
                            .admin-shell[data-bs-theme="dark"] .badge.bg-light,
                            .admin-shell[data-bs-theme="dark"] .badge.bg-white {
                                background-color: var(--bs-secondary-bg) !important;
                                color: var(--bs-body-color) !important;
                                border-color: var(--bs-border-color) !important;
                            }
                            .admin-shell[data-bs-theme="dark"] .table {
                                --bs-table-bg: transparent;
                                --bs-table-color: var(--bs-body-color);
                                --bs-table-hover-bg: var(--bs-tertiary-bg);
                            }
                            [data-bs-theme="dark"] .modal-content {
                                background-color: var(--bs-body-bg);
                                color: var(--bs-body-color);
                            }
                            [data-bs-theme="dark"] .modal-header.bg-success {
                                border-bottom-color: rgba(255, 255, 255, 0.15);
                            }
                        `}</style>

                        {isDashboardHome ? (
                            <div className="animate__animated animate__fadeIn">
                                <div className="row g-4 mb-4">
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

                                <div className="row g-4 mb-4">
                                    <div className="col-lg-8">
                                        <div className="card card-dashboard p-4 shadow-sm h-100">
                                            <h6 className="chart-title mb-4">
                                                Tendencia de Ventas (7D)
                                            </h6>
                                            <Chart
                                                options={salesOptions}
                                                series={salesSeries}
                                                type="line"
                                                height={320}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="card card-dashboard p-4 shadow-sm h-100">
                                            <h6 className="chart-title mb-4">
                                                Stock por Categoría
                                            </h6>
                                            <Chart
                                                options={categoryOptions}
                                                series={categorySeries}
                                                type="donut"
                                                height={320}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-4 mb-4">
                                    <div className="col-lg-6">
                                        <div className="card card-dashboard p-4 shadow-sm h-100">
                                            <h6 className="chart-title mb-4">
                                                Top 5 Proveedores
                                            </h6>
                                            <Chart
                                                options={supplierOptions}
                                                series={supplierSeries}
                                                type="bar"
                                                height={300}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="card card-dashboard p-4 shadow-sm h-100">
                                            <h6 className="chart-title mb-4">
                                                Rendimiento de Empleados
                                            </h6>
                                            <Chart
                                                options={employeeOptions}
                                                series={employeeSeries}
                                                type="radar"
                                                height={300}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-4 mb-4">
                                    <div className="col-lg-8">
                                        <div className="card card-dashboard p-4 shadow-sm h-100">
                                            <h6 className="chart-title mb-4">
                                                Densidad de Ventas por Hora
                                            </h6>
                                            <Chart
                                                options={heatMapOptions}
                                                series={metrics.heatMapSeries}
                                                type="heatmap"
                                                height={280}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="card card-dashboard p-4 shadow-sm h-100 text-center">
                                            <h6 className="chart-title mb-4">
                                                Cumplimiento de Objetivos
                                            </h6>
                                            <Chart
                                                options={goalOptions}
                                                series={[metrics.goalPercent]}
                                                type="radialBar"
                                                height={280}
                                            />
                                            <p className="small text-muted mt-n2">
                                                {dashboardLoading
                                                    ? "Calculando meta..."
                                                    : `Faltan ${metrics.goalRemaining}% para llegar a la meta`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="row g-4">
                                    <div className="col-12">
                                        <div className="card card-dashboard p-4 shadow-sm">
                                            <h6 className="chart-title mb-4">
                                                Alerta de Inventario Crítico
                                            </h6>
                                            <div className="table-responsive">
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
                                            </div>
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
