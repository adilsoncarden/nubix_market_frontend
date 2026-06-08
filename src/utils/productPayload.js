/** Mapea el formulario al JSON esperado por ProductoRequest (snake_case). */
export const mapProductPayload = (form) => {
    const categoriaId = Number(form.categoriaId);
    if (!categoriaId || Number.isNaN(categoriaId)) {
        throw new Error("Selecciona una categoría válida");
    }
    return {
        codigo: String(form.codigo ?? "").trim(),
        nombre: String(form.nombre ?? "").trim(),
        descripcion: String(form.descripcion ?? "").trim(),
        categoria_id: categoriaId,
        precio_compra: Number(form.precioCompra) || 0,
        precio_venta: Number(form.precioVenta) || 0,
        stock: Number(form.stock) || 0,
        url_imagen: form.urlImagen ? String(form.urlImagen).trim() : null,
    };
};
