/**
 * Modal base del panel administrativo (diseño unificado).
 */
export default function AdminModal({
    modalRef,
    id,
    title,
    titleId,
    onClose,
    size = "",
    scrollable = false,
    closeDisabled = false,
    contentClassName = "",
    contentStyle,
    bodyClassName = "",
    children,
}) {
    const dialogClasses = [
        "modal-dialog",
        "modal-dialog-centered",
        size === "lg" ? "modal-lg" : "",
        size === "xl" ? "modal-xl" : "",
        scrollable ? "modal-dialog-scrollable" : "",
    ]
        .filter(Boolean)
        .join(" ");

    const contentClasses = [
        "modal-content",
        "admin-modal-content",
        "border-0",
        "shadow-lg",
        contentClassName,
    ]
        .filter(Boolean)
        .join(" ");

    const bodyClasses = [
        "modal-body",
        "admin-modal-body",
        bodyClassName || "p-4",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className="modal fade admin-modal"
            id={id}
            ref={modalRef}
            tabIndex="-1"
            data-bs-backdrop="static"
            aria-labelledby={titleId}
            aria-hidden="true"
        >
            <div className={dialogClasses}>
                <div className={contentClasses} style={contentStyle}>
                    <div className="modal-header admin-modal-header border-0">
                        <h5
                            className="modal-title admin-modal-title fw-bold text-dark d-flex align-items-center mb-0"
                            id={titleId}
                        >
                            <span
                                className="admin-modal-indicator"
                                aria-hidden="true"
                            />
                            {title}
                        </h5>
                        <button
                            type="button"
                            className="btn-close shadow-none"
                            onClick={onClose}
                            disabled={closeDisabled}
                            aria-label="Cerrar"
                        />
                    </div>
                    <div className={bodyClasses}>{children}</div>
                </div>
            </div>
        </div>
    );
}

/**
 * Acciones inferiores estándar: Cerrar + Confirmar (submit externo por form id).
 */
export function AdminModalActions({
    onClose,
    submitForm,
    inlineSubmit = false,
    saving = false,
    closeDisabled = false,
    cancelLabel = "Cerrar",
    confirmLabel = "Confirmar",
    savingLabel = "Guardando...",
    confirmIcon = "bi-save2-fill",
}) {
    return (
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top admin-modal-footer">
            <button
                type="button"
                className="btn btn-light fw-bold text-secondary px-4 border admin-modal-btn-secondary"
                onClick={onClose}
                disabled={closeDisabled || saving}
            >
                {cancelLabel}
            </button>
            <button
                type="submit"
                form={inlineSubmit ? undefined : submitForm}
                className="btn btn-success px-5 fw-bold shadow-sm admin-btn-primary admin-modal-btn-primary"
                disabled={saving}
            >
                {saving ? (
                    <span className="spinner-border spinner-border-sm me-2" />
                ) : (
                    <i className={`bi ${confirmIcon} me-2`} />
                )}
                {saving ? savingLabel : confirmLabel}
            </button>
        </div>
    );
}
