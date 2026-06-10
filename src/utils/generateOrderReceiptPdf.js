import {
    measureClosingHeight,
    resolveTableRowStartY,
    ensureClosingFits,
} from "./receiptPdfLayout";

const COLORS = {
    VERDE_NUBIX: [34, 153, 84],
    NEGRO_TEXTO: [40, 40, 40],
    GRIS_FONDO: [248, 250, 252],
    GRIS_LINEA: [203, 213, 225],
    GRIS_TEXTO: [100, 116, 139],
};

const PAGE = {
    WIDTH: 210,
    HEIGHT: 297,
    LEFT: 15,
    RIGHT: 195,
    FOOTER_H: 52,
};

/** Última coordenada Y usable antes del footer fijo */
const MAX_FLOW_Y = PAGE.HEIGHT - PAGE.FOOTER_H;

function formatMoney(value) {
    return `S/ ${Number(value ?? 0).toFixed(2)}`;
}

function getComprobanteTitle(tipo) {
    return tipo === "boleta" ? "BOLETA ELECTRÓNICA" : "FACTURA ELECTRÓNICA";
}

function drawFirstPageHeader(doc, orden) {
    const { tipo, numero, fecha, cliente, codigoRecojo } = orden;

    doc.setFillColor(...COLORS.VERDE_NUBIX);
    doc.rect(0, 0, PAGE.WIDTH, 55, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("NUBIX", PAGE.LEFT, 22);
    doc.text("MARKET", PAGE.LEFT, 32);

    doc.setFontSize(18);
    doc.text(getComprobanteTitle(tipo), PAGE.RIGHT, 35, { align: "right" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("(55) 1234-5678", PAGE.LEFT, 45);
    doc.text("Calle San Pedro, Comas", PAGE.LEFT, 50);

    doc.setTextColor(...COLORS.NEGRO_TEXTO);
    doc.setFontSize(10);

    let y = 75;
    doc.setFont("helvetica", "normal");
    doc.text("FECHA:", PAGE.LEFT, y);
    doc.text(fecha, PAGE.RIGHT, y, { align: "right" });

    y += 8;
    doc.text("CLIENTE:", PAGE.LEFT, y);
    const nombreCliente =
        tipo === "boleta" ? cliente.nombre : cliente.razonSocial;
    doc.setFont("helvetica", "bold");
    doc.text(String(nombreCliente).toUpperCase(), PAGE.RIGHT, y, {
        align: "right",
    });

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(tipo === "boleta" ? "DNI:" : "RUC:", PAGE.LEFT, y);
    doc.text(
        tipo === "boleta" ? cliente.dni : cliente.ruc,
        PAGE.RIGHT,
        y,
        { align: "right" },
    );

    y += 8;
    doc.text("CÓDIGO PEDIDO:", PAGE.LEFT, y);
    doc.setTextColor(...COLORS.VERDE_NUBIX);
    doc.setFont("helvetica", "bold");
    doc.text(numero, PAGE.RIGHT, y, { align: "right" });

    if (codigoRecojo) {
        y += 8;
        doc.setTextColor(...COLORS.NEGRO_TEXTO);
        doc.setFont("helvetica", "normal");
        doc.text("CÓDIGO DE RECOJO:", PAGE.LEFT, y);
        doc.setTextColor(...COLORS.VERDE_NUBIX);
        doc.setFont("helvetica", "bold");
        doc.text(String(codigoRecojo), PAGE.RIGHT, y, { align: "right" });
    }

    return y + 14;
}

function drawContinuationHeader(doc, orden) {
    doc.setFillColor(...COLORS.VERDE_NUBIX);
    doc.rect(0, 0, PAGE.WIDTH, 22, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("NUBIX MARKET", PAGE.LEFT, 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
        `${getComprobanteTitle(orden.tipo)} · ${orden.numero}`,
        PAGE.RIGHT,
        14,
        { align: "right" },
    );

    return 32;
}

function drawTableHeader(doc, startY) {
    doc.setDrawColor(...COLORS.GRIS_LINEA);
    doc.setLineWidth(0.5);
    doc.line(PAGE.LEFT, startY, PAGE.RIGHT, startY);

    doc.setTextColor(...COLORS.NEGRO_TEXTO);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Artículo", PAGE.LEFT + 2, startY + 7);
    doc.text("Cantidad", 110, startY + 7);
    doc.text("Precio", 145, startY + 7);
    doc.text("Subtotal", PAGE.RIGHT, startY + 7, { align: "right" });

    doc.line(PAGE.LEFT, startY + 11, PAGE.RIGHT, startY + 11);

    return startY + 17;
}

function measureItemRow(doc, item) {
    const lines = doc.splitTextToSize(String(item.name), 88);
    const rowHeight = Math.max(8, lines.length * 5 + 2);
    return { lines, rowHeight };
}

function drawItemRow(doc, item, currentY, index, lines, rowHeight) {
    if (index % 2 === 0) {
        doc.setFillColor(...COLORS.GRIS_FONDO);
        doc.rect(PAGE.LEFT, currentY - 5, 180, rowHeight, "F");
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.NEGRO_TEXTO);
    doc.text(lines, PAGE.LEFT + 2, currentY);
    doc.text(String(item.qty), 118, currentY, { align: "center" });
    doc.text(formatMoney(item.price), 145, currentY);
    doc.text(formatMoney(item.price * item.qty), PAGE.RIGHT, currentY, {
        align: "right",
    });

    return currentY + rowHeight;
}

function drawTotalsBlock(doc, startY, orden) {
    const { subtotalBase, igv, delivery, total } = orden;
    const boxLeft = 118;
    let y = startY + 8;

    doc.setDrawColor(...COLORS.GRIS_LINEA);
    doc.setLineWidth(0.6);
    doc.line(boxLeft, y, PAGE.RIGHT, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.NEGRO_TEXTO);

    const rows = [
        ["Subtotal (sin IGV):", formatMoney(subtotalBase)],
        ["IGV (13%):", formatMoney(igv)],
    ];
    if ((delivery ?? 0) > 0) {
        rows.push(["Envío:", formatMoney(delivery)]);
    }

    rows.forEach(([label, value]) => {
        doc.text(label, boxLeft + 4, y);
        doc.text(value, PAGE.RIGHT, y, { align: "right" });
        y += 7;
    });

    y += 2;
    doc.setLineWidth(0.8);
    doc.line(boxLeft, y, PAGE.RIGHT, y);
    y += 9;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.NEGRO_TEXTO);
    doc.text("TOTAL:", boxLeft + 4, y);
    doc.setTextColor(...COLORS.VERDE_NUBIX);
    doc.text(formatMoney(total), PAGE.RIGHT, y, { align: "right" });

    y += 5;
    doc.setDrawColor(...COLORS.GRIS_LINEA);
    doc.setLineWidth(0.6);
    doc.line(boxLeft, y, PAGE.RIGHT, y);

    return y + 10;
}

function drawThanksMessage(doc, startY) {
    let y = startY + 4;

    doc.setDrawColor(...COLORS.GRIS_LINEA);
    doc.setLineWidth(0.5);
    doc.line(55, y, 155, y);

    y += 12;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.NEGRO_TEXTO);
    doc.text("¡Gracias por su compra!", PAGE.WIDTH / 2, y, {
        align: "center",
    });

    return y + 10;
}

function drawFooter(doc) {
    const footerY = PAGE.HEIGHT - PAGE.FOOTER_H;

    doc.setFillColor(...COLORS.VERDE_NUBIX);
    doc.rect(0, footerY, PAGE.WIDTH, PAGE.FOOTER_H, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Información de pago", PAGE.LEFT, footerY + 15);
    doc.setFont("helvetica", "normal");
    doc.text("Nubix Market SAC", PAGE.LEFT, footerY + 23);
    doc.text("BCP - Cuenta Corriente", PAGE.LEFT, footerY + 28);
    doc.text("191-01234567-0-89", PAGE.LEFT, footerY + 33);

    doc.setFont("helvetica", "bold");
    doc.text("Contacto", 130, footerY + 15);
    doc.setFont("helvetica", "normal");
    doc.text("(55) 1234-5678", 130, footerY + 23);
    doc.text("soporte@nubixmarket.com", 130, footerY + 28);
    doc.text("www.nubixmarket.com", 130, footerY + 33);
}

function beginContinuationPage(doc, orden) {
    let y = drawContinuationHeader(doc, orden);
    return drawTableHeader(doc, y);
}

export async function generateOrderReceiptPdf(orden) {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const items = Array.isArray(orden.items) ? orden.items : [];
    const closingHeight = measureClosingHeight(orden);

    let currentY = drawFirstPageHeader(doc, orden);
    currentY = drawTableHeader(doc, currentY);

    let rowIndex = 0;
    items.forEach((item, itemIndex) => {
        const { lines, rowHeight } = measureItemRow(doc, item);
        const nextY = resolveTableRowStartY({
            doc,
            currentY,
            rowHeight,
            items,
            itemIndex,
            maxFlowY: MAX_FLOW_Y,
            closingHeight,
            measureRow: measureItemRow,
            onNewPage: () => {
                rowIndex = 0;
            },
        });

        if (nextY === null) {
            currentY = beginContinuationPage(doc, orden);
        }

        currentY = drawItemRow(doc, item, currentY, rowIndex, lines, rowHeight);
        rowIndex += 1;
    });

    const closingStart = ensureClosingFits(
        doc,
        currentY,
        closingHeight,
        MAX_FLOW_Y,
        () => {},
    );
    if (closingStart === null) {
        currentY = drawContinuationHeader(doc, orden) + 6;
    }

    currentY = drawTotalsBlock(doc, currentY, orden);
    drawThanksMessage(doc, currentY);

    drawFooter(doc);
    doc.save(`${orden.tipo}-${orden.numero}.pdf`);
}
