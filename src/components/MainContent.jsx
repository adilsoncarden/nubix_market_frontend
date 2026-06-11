
import React, { useEffect, useState } from "react";
import { Carousel } from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";
import { useShopProducts } from "../features/products/hooks/useShopProducts";
import FlashProductCard from "./landing/FlashProductCard";
import "../styles/landing.css";

import slide1 from "../assets/imagen1.png";
import slide2 from "../assets/imagen2.png";
import slide3 from "../assets/imagen3.png";
import slide4 from "../assets/imagen4.png";
import slide5 from "../assets/imagen5.png";
import slide6 from "../assets/imagen6.png";

export const CATEGORIAS_DATA = [
  { nombre: "Gaseosas",   img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&q=80", color: "#e3f2fd", text: "#1565c0" },
  { nombre: "Frutas",    img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&q=80", color: "#f1f8e9", text: "#2e7d32" },
  { nombre: "Lácteos",   img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80", color: "#fff3e0", text: "#e65100" },
  { nombre: "Snacks",    img: "https://tse2.mm.bing.net/th/id/OIP.mkWFpeW-AOHmEu6kqN1IpAHaJz?pid=Api&P=0&h=180", color: "#fce4ec", text: "#c62828" },
  { nombre: "Abarrotes", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80", color: "#f3e5f5", text: "#6a1b9a" },
  { nombre: "Bebidas",   img: "https://tse1.mm.bing.net/th/id/OIP.hF6gCMuONIZoD4N0TpqxuwHaHa?pid=Api&P=0&h=180", color: "#e0f2f1", text: "#00695c" },
];

const SLIDES_FIXED = [
  { img: slide1, to: "/shop" },
  { img: slide2, to: "/shop?category=Frutas" },
  { img: slide3, to: "/shop?category=Abarrotes" },
  { img: slide4, to: "/shop?category=Bebidas" },
  { img: slide5, to: "/shop?category=Snacks" },
  { img: slide6, to: "/shop?category=Lácteos" },
];

const BENEFICIOS = [
  { icono: "bi-truck", titulo: "Envio Rapido", sub: "Directo a tu casa" },
  { icono: "bi-shield-check", titulo: "Pago Seguro", sub: "Transacciones protegidas" },
  { icono: "bi-star", titulo: "Calidad Nubix", sub: "Productos seleccionados" },
  { icono: "bi-chat-dots", titulo: "Soporte Inmediato", sub: "Atencion personalizada" },
];

const CountdownDisplay = ({ seconds }) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return (
    <div className="landing-countdown">
      <span className="landing-countdown-block">{h}</span>
      <span className="landing-countdown-sep">:</span>
      <span className="landing-countdown-block">{m}</span>
      <span className="landing-countdown-sep">:</span>
      <span className="landing-countdown-block">{s}</span>
    </div>
  );
};

const ProductSectionHeader = ({ title, timeLeft, seeAllTo = "/shop" }) => (
  <div className="landing-section-header">
    <div className="d-flex flex-wrap align-items-center gap-3">
      <h2 className="landing-section-title">{title}</h2>
      {timeLeft != null && <CountdownDisplay seconds={timeLeft} />}
    </div>
    <Link to={seeAllTo} className="landing-see-all">
      Ver todo <i className="bi bi-arrow-right-short" />
    </Link>
  </div>
);

const MainContent = () => {
  const { products, loading: productsLoading } = useShopProducts();
  const flashProducts = products.slice(0, 4);
  const popularProducts = products.slice(4, 8);
  const featuredProducts = products.slice(0, 8);

  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 45 * 60 + 12);

  useEffect(() => {
    const mainEl = document.querySelector("#heroCarousel");
    if (mainEl) {
      new Carousel(mainEl, { interval: 8000, pause: false, ride: "carousel" });
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const renderProductGrid = (items) => {
    if (productsLoading) {
      return (
        <div className="col-12 text-center py-4">
          <div className="spinner-border text-success" role="status" />
        </div>
      );
    }
    if (items.length > 0) {
      return items.map((p) => (
        <div key={p.id} className="col">
          <FlashProductCard p={p} />
        </div>
      ));
    }
    return (
      <div className="col-12 text-center text-muted py-4">
        No hay productos disponibles
      </div>
    );
  };

  return (
    <div className="landing-page">
      <section className="container landing-hero-section">
        <div className="landing-hero">
          <div className="landing-hero-overlay" aria-hidden="true" />
          <div className="landing-hero-content">
            <span className="landing-hero-badge">¡Oferta 3x2 en Frutas!</span>
            <h1 className="landing-hero-title">Frescura directa del campo a tu hogar</h1>
            <Link to="/shop" className="btn-landing-cta">Comprar Ahora</Link>
          </div>
          <div id="heroCarousel" className="carousel slide carousel-fade h-100">
            <div className="carousel-indicators">
              {SLIDES_FIXED.map((_, i) => (
                <button key={i} type="button" data-bs-target="#heroCarousel" data-bs-slide-to={i} className={i === 0 ? "active" : ""} />
              ))}
            </div>
            <div className="carousel-inner hero-inner">
              {SLIDES_FIXED.map((s, i) => (
                <div key={i} className={`carousel-item h-100 ${i === 0 ? "active" : ""}`}>
                  <Link to={s.to}>
                    <img src={s.img} className="hero-img d-block w-100 h-100" alt="slide" loading="lazy" />
                  </Link>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" />
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" />
            </button>
          </div>
        </div>
      </section>

      <section className="container landing-features">
        <div className="row g-3">
          {BENEFICIOS.map((b) => (
            <div key={b.titulo} className="col-6 col-lg-3">
              <div className="landing-feature-card">
                <div className="landing-feature-icon">
                  <i className={`bi ${b.icono}`} />
                </div>
                <p className="landing-feature-title">{b.titulo}</p>
                <p className="landing-feature-sub">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-4 landing-promo-mosaic">
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <Link
              to="/shop?category=Frutas"
              className="landing-promo-banner d-block text-decoration-none"
              style={{ backgroundImage: "url(https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1200&q=80)" }}
            >
              <div className="landing-promo-banner-content">
                <h3>Frutas del Huerto</h3>
                <span className="btn-promo-minimal">Comprar ahora →</span>
              </div>
            </Link>
          </div>
          <div className="col-md-6">
            <Link
              to="/shop?category=Abarrotes"
              className="landing-promo-banner d-block text-decoration-none"
              style={{ backgroundImage: "url(https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80)" }}
            >
              <div className="landing-promo-banner-content">
                <h3>Verduras Frescas</h3>
                <span className="btn-promo-minimal">Comprar ahora →</span>
              </div>
            </Link>
          </div>
        </div>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="landing-promo-mini landing-promo-mini--green">
              <span className="landing-promo-badge">BIO</span>
              <h4>Productos orgánicos seleccionados</h4>
              <Link to="/shop" className="landing-promo-link">Ver Promo &gt;</Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="landing-promo-mini landing-promo-mini--pink">
              <span className="landing-promo-badge">CUIDADO</span>
              <h4>Cuidado personal con descuento</h4>
              <Link to="/shop" className="landing-promo-link">Ver Promo &gt;</Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="landing-promo-mini landing-promo-mini--yellow">
              <span className="landing-promo-badge">HOGAR</span>
              <h4>Limpieza y hogar en oferta</h4>
              <Link to="/shop" className="landing-promo-link">Ver Promo &gt;</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-4 landing-product-sections">
        <ProductSectionHeader title="Ofertas Flash" timeLeft={timeLeft} seeAllTo="/shop" />
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 landing-product-grid">
          {renderProductGrid(flashProducts)}
        </div>
      </section>

      <section className="container py-4 pb-4 pb-md-5 landing-product-sections">
        <ProductSectionHeader title="Los más pedidos" timeLeft={null} seeAllTo="/shop" />
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 landing-product-grid">
          {renderProductGrid(
            popularProducts.length > 0
              ? popularProducts
              : featuredProducts.slice(0, 4),
          )}
        </div>
      </section>
    </div>
  );
};

export default MainContent;
