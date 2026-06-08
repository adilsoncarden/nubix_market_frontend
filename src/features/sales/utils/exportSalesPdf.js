import {
    formatSaleDateTime,
    getSaleClientLabel,
} from "../services/saleService";

export async function exportSalesPdf(sales) {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF({ orientation: "landscape" });
    const fecha = new Date().toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    doc.setFontSize(18);
    doc.setTextColor(25, 135, 84);
    doc.text("Reporte de Ventas", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha: ${fecha}`, 14, 28);
    doc.text(`Total de registros: ${sales.length}`, 14, 34);

    autoTable(doc, {
        startY: 42,
        head: [["ID", "Cliente", "Fecha", "Total", "Método Pago", "Estado"]],
        body: sales.map((sale) => [
            sale.id ?? "",
            getSaleClientLabel(sale),
            formatSaleDateTime(sale),
            sale.total != null ? `S/ ${Number(sale.total).toFixed(2)}` : "—",
            sale.metodoPago ?? "—",
            sale.estadoPedido ?? "—",
        ]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: {
            fillColor: [25, 135, 84],
            textColor: 255,
            fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [245, 250, 247] },
        margin: { left: 14, right: 14 },
    });

    const fileDate = new Date().toISOString().slice(0, 10);
    doc.save(`ventas_${fileDate}.pdf`);
}
