/**
 * Utilidades compartidas para paginación inteligente en comprobantes PDF.
 */

export function measureClosingHeight(orden, { hasDelivery = false } = {}) {
    const deliveryRow = hasDelivery || (orden?.delivery ?? 0) > 0 ? 7 : 0;
    const totalsHeight = 56 + deliveryRow;
    const thanksHeight = 26;
    return totalsHeight + thanksHeight;
}

export function sumRemainingRowsHeight(doc, items, fromIndex, measureRow) {
    let height = 0;
    for (let i = fromIndex; i < items.length; i += 1) {
        height += measureRow(doc, items[i]).rowHeight;
    }
    return height;
}

/**
 * Decide si hace falta nueva página antes de dibujar la fila actual.
 * Reserva espacio para totales + gracias en la última página de ítems.
 */
export function resolveTableRowStartY({
    doc,
    currentY,
    rowHeight,
    items,
    itemIndex,
    maxFlowY,
    closingHeight,
    measureRow,
    onNewPage,
}) {
    const tailRowsHeight = sumRemainingRowsHeight(doc, items, itemIndex, measureRow);
    const tailWithClosing = tailRowsHeight + closingHeight;
    const fitsRemainderOnPage = currentY + tailWithClosing <= maxFlowY;

    const tableBottom = fitsRemainderOnPage
        ? maxFlowY - closingHeight
        : maxFlowY;

    if (currentY + rowHeight <= tableBottom) {
        return currentY;
    }

    doc.addPage();
    onNewPage?.();
    return null;
}

/**
 * Antes de totales: nueva página solo si realmente no caben en la página actual.
 */
export function ensureClosingFits(doc, currentY, closingHeight, maxFlowY, onNewPage) {
    if (currentY + closingHeight <= maxFlowY) {
        return currentY;
    }
    doc.addPage();
    onNewPage?.();
    return null;
}
