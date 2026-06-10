import {
    formatSaleDateTime,
    getSaleClientLabel,
    mapSaleDetailLine,
} from "../services/saleService";

const COLORS = {
    VERDE: [25, 135, 84],
    NEGRO: [40, 40, 40],
    GRIS_FONDO: [248, 250, 252],
    GRIS_LINEA: [203, 213, 225],
};

const PAGE = {
    WIDTH: 210,
    HEIGHT: 297,
    LEFT: 14,
    RIGHT: 196,
    FOOTER_H: 40,
    CONTENT_BOTTOM: 262,
};

function getComprobanteTitle(tipo) {
    if (tipo === "BOLETA") return "BOLETA ELECTRÓNICA";
    if (tipo === "FACTURA") return "FACTURA ELECTRÓNICA";
    return "TICKET DE VENTA";
}

function getClientDocument(sale) {
    const tipo = sale.tipoComprobante;
    if (tipo === "FACTURA") {
        return {
            label: "RUC",
            value: sale.ruc || "—",
            extra: sale.direccionFiscal
                ? `Dir. fiscal: ${sale.direccionFiscal}`
                : null,
        };
    }
    if (tipo === "BOLETA") {
        return {
            label: "DNI",
            value: sale.dni || "—",
            extra: sale.emailComprobante
                ? `Email: ${sale.emailComprobante}`
                : null,
        };
    }
    return null;
}

function formatMoney(value) {
    return `S/ ${Number(value ?? 0).toFixed(2)}`;
}

function drawSaleHeader(doc, sale) {
    const tipo = sale.tipoComprobante || "TICKET";

    doc.setFillColor(...COLORS.VERDE);
    doc.rect(0, 0, PAGE.WIDTH, 48, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("NUBIX MARKET", PAGE.LEFT, 20);

    doc.setFontSize(12);
    doc.text(getComprobanteTitle(tipo), PAGE.RIGHT, 20, { align: "right" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Venta #${sale.id}`, PAGE.RIGHT, 28, { align: "right" });
    doc.text(formatSaleDateTime(sale), PAGE.RIGHT, 34, { align: "right" });

    doc.setTextColor(...COLORS.NEGRO);
    doc.setFontSize(10);
    let y = 60;

    doc.setFont("helvetica", "bold");
    doc.text("Cliente:", PAGE.LEFT, y);
    doc.setFont("helvetica", "normal");
    doc.text(getSaleClientLabel(sale), PAGE.RIGHT, y, { align: "right" });
    y += 8;

    const docInfo = getClientDocument(sale);
    if (docInfo) {
        doc.setFont("helvetica", "bold");
        doc.text(`${docInfo.label}:`, PAGE.LEFT, y);
        doc.setFont("helvetica", "normal");
        doc.text(String(docInfo.value), PAGE.RIGHT, y, { align: "right" });
        y += 8;
        if (docInfo.extra) {
            doc.text(docInfo.extra, PAGE.LEFT, y);
            y += 8;
        }
    }

    doc.setFont("helvetica", "bold");
    doc.text("Método de pago:", PAGE.LEFT, y);
    doc.setFont("helvetica", "normal");
    doc.text(sale.metodoPago || "—", PAGE.RIGHT, y, { align: "right" });

    return y + 12;
}

function drawContinuationHeader(doc, sale) {
    doc.setFillColor(...COLORS.VERDE);
    doc.rect(0, 0, PAGE.WIDTH, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("NUBIX MARKET", PAGE.LEFT, 13);
    doc.setFont("helvetica", "normal");
    doc.text(
        `${getComprobanteTitle(sale.tipoComprobante)} · Venta #${sale.id}`,
        PAGE.RIGHT,
        13,
        { align: "right" },
    );
    return 30;
}

function drawTableHeader(doc, startY) {
    doc.setDrawColor(...COLORS.GRIS_LINEA);
    doc.line(PAGE.LEFT, startY, PAGE.RIGHT, startY);
    startY += 8;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.NEGRO);
    doc.text("Artículo", PAGE.LEFT, startY);
    doc.text("Cant.", 120, startY);
    doc.text("Subtotal", PAGE.RIGHT, startY, { align: "right" });
    startY += 6;
    doc.line(PAGE.LEFT, startY, PAGE.RIGHT, startY);

    return startY + 6;
}

function measureItemRow(doc, name) {
    const lines = doc.splitTextToSize(String(name), 95);
    const rowHeight = Math.max(7, lines.length * 5 + 2);
    return { lines, rowHeight };
}

function drawItemRow(doc, item, currentY, index, lines, rowHeight) {
    if (index % 2 === 0) {
        doc.setFillColor(...COLORS.GRIS_FONDO);
        doc.rect(PAGE.LEFT, currentY - 5, 182, rowHeight, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.text(lines, PAGE.LEFT, currentY);
    doc.text(String(item.qty), 124, currentY);
    doc.text(formatMoney(item.subtotal), PAGE.RIGHT, currentY, {
        align: "right",
    });
    return currentY + rowHeight;
}

function ensureTableSpace(doc, currentY, rowHeight, sale, onNewPage) {
    if (currentY + rowHeight <= PAGE.CONTENT_BOTTOM) return currentY;
    doc.addPage();
    onNewPage();
    let y = drawContinuationHeader(doc, sale);
    return drawTableHeader(doc, y);
}

function drawTotalsBlock(doc, startY, sale) {
    const subtotal = Number(sale.subtotal ?? 0);
    const igv = Number(sale.igv ?? 0);
    const total = Number(sale.total ?? 0);
    const boxLeft = 118;
    let y = startY + 8;

    doc.setDrawColor(...COLORS.GRIS_LINEA);
    doc.setLineWidth(0.6);
    doc.line(boxLeft, y, PAGE.RIGHT, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.NEGRO);

    doc.text("Subtotal (sin IGV):", boxLeft + 4, y);
    doc.text(formatMoney(subtotal), PAGE.RIGHT, y, { align: "right" });
    y += 8;
    doc.text("IGV (13%):", boxLeft + 4, y);
    doc.text(formatMoney(igv), PAGE.RIGHT, y, { align: "right" });
    y += 10;

    doc.setLineWidth(0.8);
    doc.line(boxLeft, y, PAGE.RIGHT, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL:", boxLeft + 4, y);
    doc.setTextColor(...COLORS.VERDE);
    doc.text(formatMoney(total), PAGE.RIGHT, y, { align: "right" });
    y += 6;
    doc.setDrawColor(...COLORS.GRIS_LINEA);
    doc.setLineWidth(0.6);
    doc.line(boxLeft, y, PAGE.RIGHT, y);

    return y + 14;
}

function drawThanksMessage(doc, startY) {
    let y = startY + 6;
    doc.setDrawColor(...COLORS.GRIS_LINEA);
    doc.line(55, y, 155, y);
    y += 14;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.NEGRO);
    doc.text("¡Gracias por su compra!", PAGE.WIDTH / 2, y, {
        align: "center",
    });
    return y + 10;
}

export async function printSaleReceipt(sale) {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    const items = (sale.detalles || []).map((raw) => {
        const d = mapSaleDetailLine(raw);
        return {
            name: d.producto?.nombre || "Producto",
            qty: d.cantidad,
            subtotal: d.subtotal,
        };
    });

    let currentY = drawSaleHeader(doc, sale);
    currentY = drawTableHeader(doc, currentY);

    let rowIndex = 0;
    items.forEach((item) => {
        const { lines, rowHeight } = measureItemRow(doc, item.name);
        currentY = ensureTableSpace(doc, currentY, rowHeight, sale, () => {
            rowIndex = 0;
        });
        currentY = drawItemRow(doc, item, currentY, rowIndex, lines, rowHeight);
        rowIndex += 1;
    });

    const footerTop = PAGE.HEIGHT - PAGE.FOOTER_H - 8;
    if (currentY + 70 > footerTop) {
        doc.addPage();
        currentY = drawContinuationHeader(doc, sale) + 8;
    }

    currentY = drawTotalsBlock(doc, currentY, sale);
    drawThanksMessage(doc, currentY);

    doc.autoPrint({ variant: "non-conform" });
    const blobUrl = doc.output("bloburl");
    const printWindow = window.open(blobUrl);

    if (printWindow) {
        printWindow.focus();
        printWindow.onload = () => {
            printWindow.print();
        };
    } else {
        doc.save(`comprobante-venta-${sale.id}.pdf`);
    }
}
