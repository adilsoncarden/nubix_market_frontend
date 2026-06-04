import {
    ORDER_TRACKING_STEPS,
    getOrderStepIndex,
} from "../../utils/orderTracking";

export default function OrderTrackingStepper({ estado }) {
    const activeIndex = getOrderStepIndex(estado);

    return (
        <div
            className="order-tracking-stepper"
            role="list"
            aria-label="Progreso del pedido"
        >
            <div className="order-tracking-track d-none d-md-flex">
                {ORDER_TRACKING_STEPS.map((step, index) => {
                    const done = index <= activeIndex;
                    const current = index === activeIndex;
                    return (
                        <div
                            key={step.key}
                            className={`order-tracking-step flex-fill text-center${done ? " is-done" : ""}${current ? " is-current" : ""}`}
                            role="listitem"
                        >
                            <div className="order-tracking-dot mx-auto">
                                {done ? (
                                    <i className="bi bi-check-lg" />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            <small className="order-tracking-label d-block mt-2">
                                {step.label}
                            </small>
                        </div>
                    );
                })}
            </div>

            <ul className="list-group list-group-flush d-md-none">
                {ORDER_TRACKING_STEPS.map((step, index) => {
                    const done = index <= activeIndex;
                    const current = index === activeIndex;
                    return (
                        <li
                            key={step.key}
                            className={`list-group-item d-flex align-items-center gap-2 border-0 px-0 py-2${done ? " text-success" : " text-muted"}${current ? " fw-semibold" : ""}`}
                        >
                            <i
                                className={`bi ${done ? "bi-check-circle-fill" : "bi-circle"}`}
                            />
                            {step.label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
