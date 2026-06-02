
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../store/CartContext";
import { productService } from "../features/products/services/productService";
import { mapProductoToShopItem } from "../features/products/utils/mapProducto";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bgPos, setBgPos] = useState("50% 50%");
  const [isZooming, setIsZooming] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    productService
      .getCatalogById(id)
      .then((data) => {
        if (!cancelled) setProducto(mapProductoToShopItem(data));
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo cargar el producto");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning rounded-4 p-4 shadow-sm">
          <h4 className="fw-bold">Producto no encontrado</h4>
          <Link to="/shop" className="btn btn-dark rounded-pill px-4 mt-2">Ir a la tienda</Link>
        </div>
      </div>
    );
  }

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBgPos(`${x}% ${y}%`);
  };

  const handleAgregarAlCarrito = () => {
    for (let i = 0; i < cantidad; i++) {
      addToCart({
        id: producto.id,
        name: producto.name,
        price: producto.price,
        img: producto.img,
      });
    }
  };

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-dark">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to={`/shop?category=${encodeURIComponent(producto.category)}`} className="text-decoration-none text-dark">{producto.category}</Link></li>
          <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">{producto.name}</li>
        </ol>
      </nav>

      <div className="row g-5">
        <div className="col-md-6">
          <div
            className="zoom-container rounded-4 shadow-sm border border-light"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => { setIsZooming(false); setBgPos("50% 50%"); }}
            style={{
              backgroundImage: isZooming ? `url(${producto.img})` : "none",
              backgroundPosition: bgPos,
              backgroundSize: "220%",
            }}
          >
            <img src={producto.img} alt={producto.name} loading="lazy" className="img-fluid w-100 h-100 p-4" style={{ objectFit: "contain", opacity: isZooming ? 0 : 1, transition: "opacity 0.15s ease" }} />
          </div>
        </div>

        <div className="col-md-6 d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-secondary rounded-pill px-3 py-1 text-uppercase" style={{ fontSize: "0.75rem" }}>{producto.category}</span>
              {producto.tag && (
                <span className="badge bg-success rounded-pill px-3 py-1" style={{ fontSize: "0.75rem" }}>{producto.tag}</span>
              )}
            </div>
            <h1 className="fw-black text-dark mb-2 display-6">{producto.name}</h1>
            <p className="text-muted small mb-3">Código: <strong className="text-dark">{producto.codigo}</strong></p>
            <hr className="my-3 text-muted opacity-25" />

            <div className="price-box my-3 p-3 bg-light rounded-4 d-inline-block w-100">
              <span className="text-muted fs-6 d-block">Precio Online:</span>
              <h2 className="text-success fw-black display-5 mb-0">S/ {producto.price.toFixed(2)}</h2>
              <div className={`mt-2 fw-bold d-flex align-items-center gap-2 ${producto.stock > 0 ? "text-success" : "text-danger"}`}>
                <i className={`bi ${producto.stock > 0 ? "bi-check-circle-fill" : "bi-x-circle-fill"}`}></i>
                {producto.stock > 0 ? `Stock disponible: ${producto.stock} unidades` : "Sin stock"}
              </div>
            </div>

            {producto.descripcion && (
              <p className="text-secondary mt-3">{producto.descripcion}</p>
            )}
          </div>

          <div className="mt-4 p-4 rounded-4 border border-light bg-white shadow-sm">
            <div className="row align-items-center g-3">
              <div className="col-auto">
                <span className="small d-block text-muted mb-1 fw-bold">Cantidad:</span>
                <div className="d-flex align-items-center border rounded-pill bg-light p-1">
                  <button type="button" className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none fw-bold fs-5" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
                  <span className="px-3 fw-bold fs-6" style={{ minWidth: "30px", textAlign: "center" }}>{cantidad}</span>
                  <button type="button" className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none fw-bold fs-5" onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))} disabled={cantidad >= producto.stock}>+</button>
                </div>
              </div>
              <div className="col">
                <button
                  className="btn btn-success w-100 rounded-pill py-3 fw-bold shadow-sm text-uppercase"
                  onClick={handleAgregarAlCarrito}
                  disabled={producto.stock <= 0}
                  style={{ backgroundColor: "#28a745", border: "none" }}
                >
                  <i className="bi bi-cart-plus-fill me-2"></i> Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .zoom-container { width: 100%; height: 450px; overflow: hidden; cursor: zoom-in; background-repeat: no-repeat; background-position: 50% 50%; background-color: #ffffff; display: flex; align-items: center; justify-content: center; }
        .fw-black { font-weight: 900 !important; }
      `}</style>
    </div>
  );
};

export default ProductDetail;
