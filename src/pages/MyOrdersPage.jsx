import { useCallback, useEffect, useMemo, useState } from "react";
import { saleService } from "../features/sales/services/saleService";
import OrderCard from "../components/orders/OrderCard";
import {
    ORDER_PERIOD_OPTIONS,
    filterActiveOrders,
    filterDeliveredOrders,
    periodToApiParam,
} from "../utils/orderDateFilter";
import "../styles/my-orders.css";
import CustomSelect from "../components/ui/CustomSelect";

export default function MyOrdersPage() {
    const [openOrders, setOpenOrders] = useState([]);
    const [historyOrders, setHistoryOrders] = useState([]);
    const [loadingOpen, setLoadingOpen] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [errorOpen, setErrorOpen] = useState("");
    const [errorHistory, setErrorHistory] = useState("");
    const [activeTab, setActiveTab] = useState("open");
    const [periodFilter, setPeriodFilter] = useState("month");

    const loadOpenOrders = useCallback(async (isPoll = false) => {
        if (!isPoll) setLoadingOpen(true);
        try {
            const data = await saleService.getMyOrders({ mes: "todos" });
            setOpenOrders(filterActiveOrders(data));
            setErrorOpen("");
        } catch {
            if (!isPoll) {
                setErrorOpen("No se pudieron cargar tus pedidos activos.");
            }
        } finally {
            if (!isPoll) setLoadingOpen(false);
        }
    }, []);

    const loadHistoryOrders = useCallback(async () => {
        setLoadingHistory(true);
        try {
            const data = await saleService.getMyOrders({
                mes: periodToApiParam(periodFilter),
            });
            setHistoryOrders(filterDeliveredOrders(data));
            setErrorHistory("");
        } catch {
            setErrorHistory("No se pudo cargar el historial de pedidos.");
        } finally {
            setLoadingHistory(false);
        }
    }, [periodFilter]);

    useEffect(() => {
        loadOpenOrders();
        const interval = setInterval(() => loadOpenOrders(true), 30000);
        return () => clearInterval(interval);
    }, [loadOpenOrders]);

    useEffect(() => {
        loadHistoryOrders();
    }, [loadHistoryOrders]);

    const periodLabel = useMemo(
        () =>
            ORDER_PERIOD_OPTIONS.find((o) => o.value === periodFilter)?.label ??
            "Este mes",
        [periodFilter],
    );

    const renderEmpty = (title, subtitle) => (
        <div className="card border-0 shadow-sm text-center py-5 px-3">
            <i className="bi bi-inbox fs-1 text-muted mb-3" />
            <h5 className="fw-semibold">{title}</h5>
            <p className="text-muted mb-0">{subtitle}</p>
        </div>
    );

    const renderList = (list, showStepper = true) => (
        <div className="list-group gap-3">
            {list.map((order) => (
                <OrderCard
                    key={order.id}
                    order={order}
                    showStepper={showStepper}
                />
            ))}
        </div>
    );

    return (
        <div className="my-orders-page py-4 py-md-5">
            <div className="container">
                <header className="text-center text-md-start mb-4">
                    <h1 className="h3 fw-bold mb-2">
                        <i className="bi bi-box-seam me-2 text-success" />
                        Mis pedidos
                    </h1>
                    <p className="text-muted mb-0">
                        Seguimiento de pedidos activos e historial de compras.
                    </p>
                </header>

                <ul
                    className="nav nav-tabs nav-fill flex-md-nowrap gap-1 mb-4 my-orders-tabs"
                    role="tablist"
                >
                    <li className="nav-item" role="presentation">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "open"}
                            className={`nav-link${activeTab === "open" ? " active" : ""}`}
                            onClick={() => setActiveTab("open")}
                        >
                            <i className="bi bi-truck me-1" />
                            Pedidos activos
                            {openOrders.length > 0 && (
                                <span className="badge bg-success ms-1">
                                    {openOrders.length}
                                </span>
                            )}
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "history"}
                            className={`nav-link${activeTab === "history" ? " active" : ""}`}
                            onClick={() => setActiveTab("history")}
                        >
                            <i className="bi bi-clock-history me-1" />
                            Historial
                        </button>
                    </li>
                </ul>

                <div className="tab-content">
                    {activeTab === "open" && (
                        <section
                            role="tabpanel"
                            aria-labelledby="tab-pedidos-activos"
                        >
                            {loadingOpen && (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-success" />
                                    <p className="text-muted mt-3 mb-0">
                                        Cargando pedidos activos...
                                    </p>
                                </div>
                            )}

                            {!loadingOpen && errorOpen && (
                                <div className="alert alert-danger">
                                    {errorOpen}
                                </div>
                            )}

                            {!loadingOpen && !errorOpen && (
                                <>
                                    {openOrders.length === 0
                                        ? renderEmpty(
                                              "No tienes pedidos activos",
                                              "Cuando realices una compra, el seguimiento en tiempo real aparecerá aquí hasta que se entregue.",
                                          )
                                        : renderList(openOrders, true)}
                                </>
                            )}
                        </section>
                    )}

                    {activeTab === "history" && (
                        <section role="tabpanel">
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                                <p className="text-muted small mb-0">
                                    Solo pedidos entregados en la tienda web.
                                </p>
                                <div className="ms-md-auto float-md-end">
                                    <label
                                        htmlFor="order-period-filter"
                                        className="visually-hidden"
                                    >
                                        Filtrar por tiempo
                                    </label>
                                    <CustomSelect
                                        id="order-period-filter"
                                        className="my-orders-period-select"
                                        size="sm"
                                        value={periodFilter}
                                        onChange={(e) =>
                                            setPeriodFilter(e.target.value)
                                        }
                                        disabled={loadingHistory}
                                        options={ORDER_PERIOD_OPTIONS.map(
                                            (opt) => ({
                                                value: opt.value,
                                                label: opt.label,
                                            }),
                                        )}
                                    />
                                </div>
                            </div>

                            {loadingHistory && (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-success" />
                                    <p className="text-muted mt-3 mb-0">
                                        Cargando historial...
                                    </p>
                                </div>
                            )}

                            {!loadingHistory && errorHistory && (
                                <div className="alert alert-danger">
                                    {errorHistory}
                                </div>
                            )}

                            {!loadingHistory && !errorHistory && (
                                <>
                                    <p className="text-muted small mb-3">
                                        Mostrando:{" "}
                                        <strong>{periodLabel}</strong>
                                        {periodFilter === "month" && (
                                            <span className="d-block d-md-inline ms-md-1">
                                                (filtro por defecto al cargar)
                                            </span>
                                        )}
                                    </p>
                                    {historyOrders.length === 0
                                        ? renderEmpty(
                                              "Sin pedidos entregados en este período",
                                              `No hay pedidos entregados para ${periodLabel.toLowerCase()}. Prueba otro rango de fechas.`,
                                          )
                                        : renderList(historyOrders, false)}
                                </>
                            )}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
