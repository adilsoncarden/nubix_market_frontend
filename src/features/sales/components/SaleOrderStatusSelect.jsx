import CustomSelect from "../../../components/ui/CustomSelect";
import {
    canSelectOrderStatus,
    formatOrderStatusLabel,
    getOrderFlowSteps,
    getOrderStepIndex,
    isOrderStatusFinal,
    isOrderStatusInFlow,
} from "../../../utils/orderTracking";

export default function SaleOrderStatusSelect({
    saleId,
    estadoPedido,
    tipoEntrega,
    onStatusChange,
}) {
    const steps = getOrderFlowSteps(tipoEntrega);
    const currentIndex = getOrderStepIndex(estadoPedido, tipoEntrega);
    const isLocked = isOrderStatusFinal(estadoPedido);

    if (!isOrderStatusInFlow(estadoPedido, tipoEntrega)) {
        return (
            <span
                className="badge bg-secondary text-uppercase"
                title="Estado no compatible con el tipo de entrega"
            >
                {formatOrderStatusLabel(estadoPedido)}
            </span>
        );
    }

    if (isLocked) {
        return (
            <span
                className="badge bg-success text-uppercase"
                title="El pedido ya fue entregado"
            >
                {formatOrderStatusLabel(estadoPedido)}
            </span>
        );
    }

    return (
        <CustomSelect
            size="sm"
            value={estadoPedido}
            onChange={(e) => {
                const next = e.target.value;
                if (
                    next !== estadoPedido &&
                    canSelectOrderStatus(estadoPedido, next, tipoEntrega)
                ) {
                    onStatusChange(saleId, next);
                }
            }}
            aria-label={`Estado del pedido ${saleId}`}
            options={steps.map((step, index) => ({
                value: step.key,
                label: step.label,
                disabled: index < currentIndex,
            }))}
        />
    );
}
