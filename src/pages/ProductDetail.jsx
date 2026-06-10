
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../store/CartContext";
import {
    productService,
    handleProductImageError,
} from "../features/products/services/productService";
import { mapProductoToShopItem } from "../features/products/utils/mapProducto";
import { useShopProducts } from "../features/products/hooks/useShopProducts";
import FlashProductCard from "../components/landing/FlashProductCard";
import "../styles/product-detail.css";
import "../styles/landing.css";

const MAX_RELATED = 6;

function buildProductHighlights(producto) {
    const bullets = [];

    if (producto.category) {
        bullets.push(`Ideal para la sección de ${producto.category} en tu hogar.`);
    }

    if (producto.stock > 0) {
        bullets.push(
            `${producto.stock} unidad${producto.stock === 1 ? "" : "es"} disponible${producto.stock === 1 ? "" : "s"} para compra online.`,
        );
    }

    if (producto.descripcion) {
        const sentences = producto.descripcion
            .split(/[.\n]/)
            .map((s) => s.trim())
            .filter((s) => s.length > 8);
        bullets.push(...sentences.slice(0, 3));
    }

    if (bullets.length === 0) {
        bullets.push("Producto seleccionado del catálogo Nubix Market.");
        bullets.push("Calidad y frescura para el abastecimiento de tu hogar.");
    }

    return bullets.slice(0, 4);
}

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products: catalogProducts } = useShopProducts();
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

  const relatedProducts = useMemo(() => {
    if (!producto?.category) return [];
    return catalogProducts
      .filter(
        (p) =>
          p.id !== producto.id &&
          p.category &&
          p.category === producto.category,
      )
      .slice(0, MAX_RELATED);
  }, [catalogProducts, producto]);

  const highlights = useMemo(
    () => (producto ? buildProductHighlights(producto) : []),
    [producto],
  );

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

  const descriptionText =
    producto.descripcion?.trim() ||
    "Producto disponible en Nubix Market. Consulta disponibilidad y agrega al carrito para completar tu compra.";

  return (
    <div className="product-detail-page container py-5">
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
            className="product-detail-zoom-container rounded-4 shadow-sm border border-light"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => { setIsZooming(false); setBgPos("50% 50%"); }}
            style={{
              backgroundImage: isZooming ? `url(${producto.img})` : "none",
              backgroundPosition: bgPos,
              backgroundSize: "220%",
            }}
          >
            <img
              src={producto.img}
              alt={producto.name}
              loading="lazy"
              className="img-fluid w-100 h-100 p-4"
              style={{ objectFit: "contain", opacity: isZooming ? 0 : 1, transition: "opacity 0.15s ease" }}
              onError={handleProductImageError}
            />
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
            <h1 className="product-detail-fw-black text-dark mb-3 display-6">{producto.name}</h1>
            <hr className="my-3 text-muted opacity-25" />

            <div className="price-box my-3 p-3 bg-light rounded-4 d-inline-block w-100">
              <span className="text-muted fs-6 d-block">Precio Online:</span>
              <h2 className="text-success product-detail-fw-black display-5 mb-0">S/ {producto.price.toFixed(2)}</h2>
              <div className={`mt-2 fw-bold d-flex align-items-center gap-2 ${producto.stock > 0 ? "text-success" : "text-danger"}`}>
                <i className={`bi ${producto.stock > 0 ? "bi-check-circle-fill" : "bi-x-circle-fill"}`}></i>
                {producto.stock > 0 ? `Stock disponible: ${producto.stock} unidades` : "Sin stock"}
              </div>
            </div>
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

      <div className="product-detail-divider" />

      <section className="product-detail-section">
        <div className="product-detail-card">
          <h2 className="product-detail-section-title">Descripción del producto</h2>
          <p className="product-detail-description">{descriptionText}</p>
          {highlights.length > 0 && (
            <ul className="product-detail-highlights">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="product-detail-section">
        <div className="product-detail-card">
          <h2 className="product-detail-section-title">Información del producto</h2>
          <div className="product-detail-info-grid">
            <div className="product-detail-info-item">
              <span className="product-detail-info-label">Categoría</span>
              <span className="product-detail-info-value">{producto.category || "—"}</span>
            </div>
            <div className="product-detail-info-item">
              <span className="product-detail-info-label">Código del producto</span>
              <span className="product-detail-info-value">{producto.codigo || "—"}</span>
            </div>
            <div className="product-detail-info-item">
              <span className="product-detail-info-label">Stock disponible</span>
              <span
                className={`product-detail-info-value ${producto.stock > 0 ? "stock-ok" : "stock-low"}`}
              >
                {producto.stock > 0
                  ? `${producto.stock} unidad${producto.stock === 1 ? "" : "es"}`
                  : "Sin stock"}
              </span>
            </div>
            {producto.marca && (
              <div className="product-detail-info-item">
                <span className="product-detail-info-label">Marca</span>
                <span className="product-detail-info-value">{producto.marca}</span>
              </div>
            )}
            {producto.origen && (
              <div className="product-detail-info-item">
                <span className="product-detail-info-label">Origen</span>
                <span className="product-detail-info-value">{producto.origen}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <>
          <div className="product-detail-divider" />
          <section className="product-detail-section">
            <div className="product-detail-related-header">
              <h2 className="product-detail-section-title mb-0">Productos relacionados</h2>
              {producto.category && (
                <Link
                  to={`/shop?category=${encodeURIComponent(producto.category)}`}
                  className="product-detail-related-link"
                >
                  Ver más en {producto.category}
                </Link>
              )}
            </div>
            <div className="product-detail-related-scroll">
              {relatedProducts.map((p) => (
                <div key={p.id} className="product-detail-related-item">
                  <FlashProductCard p={p} />
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ProductDetail;
