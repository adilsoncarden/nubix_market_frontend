/**
 * Selector ovalado - 1 + con tachito en el botón izquierdo cuando qty === 1.
 */
export default function ProductQtyControl({
    qty,
    stock = 0,
    onDecrease,
    onIncrease,
    onStockLimit,
    pillClassName = "flash-qty-pill",
    btnClassName = "flash-qty-btn",
    valueClassName = "flash-qty-value",
}) {
    const isRemoveAction = qty === 1;
    const safeStock = Math.max(0, Number(stock) || 0);
    const atStockLimit = safeStock <= 0 || qty >= safeStock;

    const handleIncreaseClick = (e) => {
        if (atStockLimit) {
            onStockLimit?.();
            return;
        }
        onIncrease(e);
    };

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
            <span className={`${valueClassName} qty-value-bump`} key={qty}>
                {qty}
            </span>
            <button
                type="button"
                className={`${btnClassName}${atStockLimit ? " qty-btn--at-limit" : ""}`}
                onClick={handleIncreaseClick}
                aria-label={
                    atStockLimit ? "Stock limitado" : "Aumentar cantidad"
                }
                title={atStockLimit ? "Stock limitado" : "Aumentar cantidad"}
            >
                <span aria-hidden="true">+</span>
            </button>
        </div>
    );
}
