import {
    formatSaleDateTime,
    getSaleClientLabel,
} from "../services/saleService";

const VERDE = [25, 135, 84];
const NEGRO = [40, 40, 40];
const GRIS = [245, 245, 245];

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

export async function printSaleReceipt(sale) {
    const { default: jsPDF } = await import("jspdf");

    const doc = new jsPDF();
    const tipo = sale.tipoComprobante || "TICKET";
    const items = (sale.detalles || []).map((d) => ({
        name: d.producto?.nombre || "Producto",
        qty: d.cantidad ?? 0,
        price: Number(d.subtotal ?? 0) / Math.max(1, Number(d.cantidad ?? 1)),
        subtotal: Number(d.subtotal ?? 0),
    }));

    doc.setFillColor(...VERDE);
    doc.rect(0, 0, 210, 48, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("NUBIX MARKET", 14, 20);

    doc.setFontSize(12);
    doc.text(getComprobanteTitle(tipo), 196, 20, { align: "right" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Venta #${sale.id}`, 196, 28, { align: "right" });
    doc.text(formatSaleDateTime(sale), 196, 34, { align: "right" });

    doc.setTextColor(...NEGRO);
    doc.setFontSize(10);
    let y = 60;

    doc.setFont("helvetica", "bold");
    doc.text("Cliente:", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(getSaleClientLabel(sale), 196, y, { align: "right" });
    y += 8;

    const docInfo = getClientDocument(sale);
    if (docInfo) {
        doc.setFont("helvetica", "bold");
        doc.text(`${docInfo.label}:`, 14, y);
        doc.setFont("helvetica", "normal");
        doc.text(String(docInfo.value), 196, y, { align: "right" });
        y += 8;
        if (docInfo.extra) {
            doc.text(docInfo.extra, 14, y);
            y += 8;
        }
    }

    doc.setFont("helvetica", "bold");
    doc.text("Método de pago:", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(sale.metodoPago || "—", 196, y, { align: "right" });
    y += 10;

    doc.setDrawColor(200);
    doc.line(14, y, 196, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Artículo", 14, y);
    doc.text("Cant.", 120, y);
    doc.text("Subtotal", 196, y, { align: "right" });
    y += 6;
    doc.line(14, y, 196, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    items.forEach((item, index) => {
        if (index % 2 === 0) {
            doc.setFillColor(...GRIS);
            doc.rect(14, y - 5, 182, 7, "F");
        }
        doc.text(String(item.name).substring(0, 52), 14, y);
        doc.text(String(item.qty), 124, y);
        doc.text(`S/ ${item.subtotal.toFixed(2)}`, 196, y, { align: "right" });
        y += 7;
    });

    y += 6;
    const subtotal = Number(sale.subtotal ?? 0);
    const igv = Number(sale.igv ?? 0);
    const total = Number(sale.total ?? 0);

    doc.text("Subtotal (sin IGV):", 150, y, { align: "right" });
    doc.text(`S/ ${subtotal.toFixed(2)}`, 196, y, { align: "right" });
    y += 7;
    doc.text("IGV (13%):", 150, y, { align: "right" });
    doc.text(`S/ ${igv.toFixed(2)}`, 196, y, { align: "right" });
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", 150, y, { align: "right" });
    doc.setTextColor(...VERDE);
    doc.text(`S/ ${total.toFixed(2)}`, 196, y, { align: "right" });

    y += 16;
    doc.setTextColor(...NEGRO);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("¡Gracias por su compra!", 14, y);

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
