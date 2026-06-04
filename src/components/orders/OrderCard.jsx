import OrderTrackingStepper from "./OrderTrackingStepper";
import {
    formatOrderStatusLabel,
    getOrderStatusBadge,
} from "../../utils/orderTracking";
import { formatSoles } from "../../utils/pricing";

function formatPedidoFecha(fecha) {
    if (!fecha) return "-";
    const raw = String(fecha);
    const [y, m, d] = raw.split("T")[0].split("-").map(Number);
    if (!y || !m || !d) return raw;
    return new Date(y, m - 1, d).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export default function OrderCard({ order, showStepper = true }) {
    return (
        <article className="list-group-item border rounded-4 shadow-sm p-3 p-md-4">
            <div className="row g-3 align-items-start">
                <div className="col-12 col-md-8">
                    <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-md-start gap-2 mb-2">
                        <h2 className="h6 fw-bold mb-0">Pedido #{order.id}</h2>
                        <span
                            className={`badge bg-${getOrderStatusBadge(order.estado)}`}
                        >
                            {formatOrderStatusLabel(order.estado)}
                        </span>
                    </div>
                    <p className="text-muted small mb-2">
                        <i className="bi bi-calendar3 me-1" />
                        {formatPedidoFecha(order.fecha)}
                        {order.tipoEntrega && (
                            <span className="ms-2">
                                · {order.tipoEntrega.replace("_", " ")}
                            </span>
                        )}
                    </p>
                    {order.codigoRecojo && (
                        <p className="small mb-2">
                            <strong>Código de recojo:</strong> {order.codigoRecojo}
                        </p>
                    )}
                    {showStepper && (
                        <OrderTrackingStepper estado={order.estado} />
                    )}
                </div>
                <div className="col-12 col-md-4 text-center text-md-end">
                    <p className="text-muted small mb-1">Total</p>
                    <p className="h5 fw-bold text-success mb-0">
                        {formatSoles(order.total)}
                    </p>
                    {order.estadoPago && (
                        <span className="badge bg-light text-dark border mt-2">
                            Pago: {order.estadoPago}
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}
