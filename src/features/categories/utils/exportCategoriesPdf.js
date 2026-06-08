export async function exportCategoriesPdf(categories) {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    doc.setFontSize(18);
    doc.setTextColor(25, 135, 84);
    doc.text("Reporte de Categorías", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha: ${fecha}`, 14, 28);
    doc.text(`Total de registros: ${categories.length}`, 14, 34);

    autoTable(doc, {
        startY: 42,
        head: [["ID", "Nombre", "Descripción"]],
        body: categories.map((cat) => [
            cat.id ?? "",
            cat.nombre ?? "",
            cat.descripcion || "—",
        ]),
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: {
            fillColor: [25, 135, 84],
            textColor: 255,
            fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [245, 250, 247] },
        margin: { left: 14, right: 14 },
    });

    const fileDate = new Date().toISOString().slice(0, 10);
    doc.save(`categorias_${fileDate}.pdf`);
}
