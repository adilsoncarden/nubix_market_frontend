/**
 * Selector ovalado - 1 + con tachito en el botón izquierdo cuando qty === 1.
 */
export default function ProductQtyControl({
    qty,
    stock = 0,
    onDecrease,
    onIncrease,
    pillClassName = "flash-qty-pill",
    btnClassName = "flash-qty-btn",
    valueClassName = "flash-qty-value",
}) {
    const isRemoveAction = qty === 1;
    const plusDisabled = stock > 0 && qty >= stock;

    return (
        <div className={pillClassName}>
            <button
                type="button"
                className={`${btnClassName}${isRemoveAction ? " qty-btn--remove" : ""}`}
                onClick={onDecrease}
                aria-label={
                    isRemoveAction ? "Eliminar del carrito" : "Reducir cantidad"
                }
                title={
                    isRemoveAction ? "Eliminar del carrito" : "Reducir cantidad"
                }
            >
                {isRemoveAction ? (
                    <i className="bi bi-trash" />
                ) : (
                    <span aria-hidden="true">−</span>
                )}
            </button>
            <span className={valueClassName}>{qty}</span>
            <button
                type="button"
                className={btnClassName}
                onClick={onIncrease}
                aria-label="Aumentar cantidad"
                title="Aumentar cantidad"
                disabled={plusDisabled}
            >
                <span aria-hidden="true">+</span>
            </button>
        </div>
    );
}
