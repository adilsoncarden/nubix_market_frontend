import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../store/AuthContext";
import Chart from "react-apexcharts";

const AdminLayout = () => {
    const { user } = useAuth();
    const location = useLocation();

    const isDashboardHome =
        location.pathname === "/admin" ||
        location.pathname === "/admin/" ||
        location.pathname.endsWith("/dashboard");

    // --- CONFIGURACIONES DE GRÁFICOS (APEXCHARTS) ---

    // 1. Ventas Semanales (Tu diseño original)
    const salesOptions = {
        chart: { id: "sales-chart", toolbar: { show: false } },
        colors: ["#198754"],
        stroke: { curve: "smooth", width: 3 },
        xaxis: {
            categories: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        },
    };
    const salesSeries = [
        { name: "Ventas", data: [30, 40, 35, 50, 49, 60, 70] },
    ];

    // 2. Distribución de Productos (Tu diseño original)
    const categoryOptions = {
        labels: ["Lácteos", "Limpieza", "Bebidas", "Cárnicos", "Otros"],
        colors: ["#198754", "#0d6efd", "#fd7e14", "#dc3545", "#6c757d"],
        legend: { position: "bottom" },
        plotOptions: { pie: { donut: { size: "65%" } } },
    };
    const categorySeries = [44, 55, 13, 33, 22];

    // 3. Rendimiento de Empleados (Tu diseño original)
    const employeeOptions = {
        chart: { toolbar: { show: false } },
        xaxis: {
            categories: [
                "Asistencia",
                "Ventas",
                "Puntualidad",
                "Soporte",
                "Gestión",
            ],
        },
        colors: ["#6f42c1"],
        fill: { opacity: 0.4 },
    };
    const employeeSeries = [
        { name: "Promedio Equipo", data: [80, 50, 30, 40, 100] },
    ];

    // 4. Top Proveedores (Tu diseño original)
    const supplierOptions = {
        plotOptions: { bar: { borderRadius: 4, horizontal: true } },
        colors: ["#20c997"],
        xaxis: {
            categories: ["Nestlé", "Gloria", "Alicorp", "Procter", "Unilever"],
        },
    };
    const supplierSeries = [
        { name: "Pedidos Mensuales", data: [400, 430, 448, 470, 540] },
    ];

    // --- NUEVOS DISEÑOS AGREGADOS ---

    // 5. Mapa de Calor (Actividad de Ventas por Hora)
    const heatMapOptions = {
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
        },
    };
    const heatMapSeries = [
        { name: "Lun", data: [10, 20, 30, 40, 50, 60, 20] },
        { name: "Mie", data: [20, 30, 45, 80, 40, 20, 10] },
        { name: "Vie", data: [30, 60, 90, 100, 80, 50, 30] },
    ];

    // 6. Meta de Ventas Mensual (Radial)
    const goalOptions = {
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                dataLabels: {
                    name: { fontSize: "14px", color: "#64748b", offsetY: 100 },
                    value: {
                        offsetY: 60,
                        fontSize: "22px",
                        color: "#1e293b",
                        formatter: (val) => val + "%",
                    },
                },
            },
        },
        fill: { colors: ["#198754"] },
        labels: ["Meta Mensual"],
    };

    const stats = [
        {
            label: "Productos",
            value: "154",
            icon: "bi-box-seam",
            color: "#198754",
        },
        {
            label: "Clientes",
            value: "1,240",
            icon: "bi-people",
            color: "#0d6efd",
        },
        {
            label: "Proveedores",
            value: "36",
            icon: "bi-truck",
            color: "#fd7e14",
        },
        {
            label: "Empleados",
            value: "12",
            icon: "bi-person-badge",
            color: "#6f42c1",
        },
    ];

    return (
        <div className="d-flex vh-100 overflow-hidden bg-light">
            <Sidebar />

            <div className="flex-grow-1 d-flex flex-column overflow-hidden">
                <header className="navbar border-bottom px-4 py-3 bg-white shadow-sm sticky-top">
                    <div className="container-fluid p-0">
                        <h5 className="m-0 fw-bold text-secondary">
                            Dashboard Operativo
                        </h5>
                        <div className="d-flex align-items-center">
                            <span className="me-3 fw-bold small text-muted">
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
                            .card-dashboard { border-radius: 18px; border: none; background: #fff; }
                            .icon-box { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                            .stat-value { font-size: 1.75rem; font-weight: 800; color: #334155; }
                            .chart-title { font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                            .table-custom thead { background-color: #f8fafc; }
                            .badge-critical { background-color: #fee2e2; color: #991b1b; border: 1px solid #f87171; }
                        `}</style>

                        {isDashboardHome ? (
                            <div className="animate__animated animate__fadeIn">
                                {/* RESUMEN SUPERIOR */}
                                <div className="row g-4 mb-4">
                                    {stats.map((stat, i) => (
                                        <div
                                            className="col-12 col-md-6 col-lg-3"
                                            key={i}
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
                                                            {stat.value}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* BLOQUE 1: VENTAS Y CATEGORÍAS (Originales) */}
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

                                {/* BLOQUE 2: PROVEEDORES Y EMPLEADOS (Originales) */}
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

                                {/* BLOQUE 3: NUEVOS DISEÑOS (Análisis Horario y Metas) */}
                                <div className="row g-4 mb-4">
                                    <div className="col-lg-8">
                                        <div className="card card-dashboard p-4 shadow-sm h-100">
                                            <h6 className="chart-title mb-4">
                                                Densidad de Ventas por Hora
                                            </h6>
                                            <Chart
                                                options={heatMapOptions}
                                                series={heatMapSeries}
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
                                                series={[76]}
                                                type="radialBar"
                                                height={280}
                                            />
                                            <p className="small text-muted mt-n2">
                                                Faltan 24% para llegar a la meta
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* BLOQUE 4: TABLA DE STOCK CRÍTICO */}
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
                                                        <tr>
                                                            <td className="fw-bold">
                                                                Leche Gloria 1L
                                                            </td>
                                                            <td>Lácteos</td>
                                                            <td className="text-danger fw-bold">
                                                                5 u.
                                                            </td>
                                                            <td>
                                                                <span className="badge badge-critical">
                                                                    Reordenar Ya
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-bold">
                                                                Detergente Opal
                                                            </td>
                                                            <td>Limpieza</td>
                                                            <td className="text-danger fw-bold">
                                                                3 u.
                                                            </td>
                                                            <td>
                                                                <span className="badge badge-critical">
                                                                    Sin Stock
                                                                </span>
                                                            </td>
                                                        </tr>
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
