
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

const ANUNCIOS_PROMO = [
  "¡APROVECHA LAS GRANDES PROMOCIONES DE LA SEMANA EN TODA LA TIENDA!",
  "DELIVERY TOTALMENTE GRATUITO POR COMPRAS SUPERIORES A S/ 100",
  "OBTÉN 10% DE DESCUENTO DIRECTO EN TU PRIMER PEDIDO REGISTRÁNDOTE HOY",
  "PAGA DE FORMA SEGURA CON CUALQUIER TARJETA O TU BILLETERA DIGITAL BIPAY",
  "PARTICIPA AUTOMÁTICAMENTE EN NUESTROS SORTEOS MENSUALES POR COMPRAS DESDE S/ 50",
  "ACUMULA PUNTOS NUBIX EN CADA COMPRA Y CANJÉALOS POR VALES DE DSCTO",
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

const DISTRITOS_LIMA = ["Ancón", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos", "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesús María", "La Molina", "La Victoria", "Lima", "Lince", "Los Olivos", "Lurigancho-Chosica", "Lurín", "Magdalena del Mar", "Miraflores", "Pachacámac", "Pucusana", "Pueblo Libre", "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo", "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores", "San Luis", "San Martín de Porres", "San Miguel", "Santa Anita", "Santa María del Mar", "Santa Rosa", "Santiago de Surco", "Surquillo", "Villa El Salvador", "Villa María del Triunfo"];
const DISTRITOS_CALLAO = ["Bellavista", "Callao", "Carmen de la Legua-Reynoso", "La Perla", "La Punta", "Mi Perú", "Ventanilla"];

const MainContent = () => {
  const { products, loading: productsLoading } = useShopProducts();
  const flashProducts = products.slice(0, 4);
  const popularProducts = products.slice(4, 8);
  const featuredProducts = products.slice(0, 8);

  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 45 * 60 + 12);
  const [promoIndex, setPromoIndex] = useState(0);
  const [promoVisible, setPromoVisible] = useState(true);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [direccionForm, setDireccionForm] = useState({ departamento: "", provincia: "", distrito: "", calle: "", numero: "", adicional: "" });
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);

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

  useEffect(() => {
    let swapTimeout;
    const cycle = setInterval(() => {
      setPromoVisible(false);
      swapTimeout = setTimeout(() => {
        setPromoIndex((prev) => (prev + 1) % ANUNCIOS_PROMO.length);
        setPromoVisible(true);
      }, 500);
    }, 4500);
    return () => {
      clearInterval(cycle);
      clearTimeout(swapTimeout);
    };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Suscripción:", subscribeEmail);
    setSubscribeEmail("");
  };

  const handleDepartamentoChange = (e) => {
    const selectedDepartamento = e.target.value;
    setDireccionForm({ ...direccionForm, departamento: selectedDepartamento, provincia: "", distrito: "" });
    if (selectedDepartamento === "Lima") setProvincias(["Lima"]);
    else if (selectedDepartamento === "Callao") setProvincias(["Callao"]);
    else setProvincias([]);
  };

  const handleProvinciaChange = (e) => {
    const selectedProvincia = e.target.value;
    setDireccionForm({ ...direccionForm, provincia: selectedProvincia, distrito: "" });
    if (selectedProvincia === "Lima") setDistritos(DISTRITOS_LIMA);
    else if (selectedProvincia === "Callao") setDistritos(DISTRITOS_CALLAO);
    else setDistritos([]);
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    console.log("Ubicación guardada:", direccionForm);
    setLocationModalOpen(false);
  };

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
      <div className="wrapper-barra-ubicacion-top">
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-start">
            <button
              type="button"
              className="bar-ubicacion-trigger"
              onClick={() => setLocationModalOpen(true)}
            >
              <i className="bi bi-geo-alt" />
              <span className="bar-ubicacion-text">Ingresa tu ubicación</span>
            </button>
          </div>
        </div>
      </div>

      {locationModalOpen && (
        <div className="modal-location-overlay" onClick={() => setLocationModalOpen(false)}>
          <div className="modal-location-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-location-header justify-content-between">
              <div className="d-flex align-items-start gap-2">
                <i className="bi bi-geo-alt" />
                <h3 className="modal-location-title">¿Dónde quieres recibir tu compra?</h3>
              </div>
              <button type="button" className="modal-location-close" onClick={() => setLocationModalOpen(false)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="modal-location-body">
              <p className="modal-location-subtitle">
                Ingresa tu dirección y te mostraremos los productos disponibles para envío
              </p>
              <form onSubmit={handleLocationSubmit}>
                <div className="mb-3">
                  <label className="form-label-custom">Departamento</label>
                  <select className="form-select-custom" value={direccionForm.departamento} onChange={handleDepartamentoChange}>
                    <option value="">Ingresa un departamento</option>
                    <option value="Lima">Lima</option>
                    <option value="Callao">Callao</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Provincia</label>
                  <select className="form-select-custom" value={direccionForm.provincia} disabled={provincias.length === 0} onChange={handleProvinciaChange}>
                    <option value="">Ingresa una provincia</option>
                    {provincias.map((provincia) => (
                      <option key={provincia} value={provincia}>{provincia}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Distrito</label>
                  <select
                    className="form-select-custom"
                    value={direccionForm.distrito}
                    disabled={distritos.length === 0}
                    onChange={(e) => setDireccionForm({ ...direccionForm, distrito: e.target.value })}
                  >
                    <option value="">Ingresa un distrito</option>
                    {distritos.map((distrito) => (
                      <option key={distrito} value={distrito}>{distrito}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Calle</label>
                  <input type="text" className="form-input-underline" placeholder="2 de Mayo" value={direccionForm.calle} onChange={(e) => setDireccionForm({ ...direccionForm, calle: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Número</label>
                  <input type="text" className="form-input-underline" placeholder="123" value={direccionForm.numero} onChange={(e) => setDireccionForm({ ...direccionForm, numero: e.target.value })} />
                </div>
                <div className="mb-4">
                  <label className="form-label-custom">Dpto./Casa/Oficina/Condominio (opcional)</label>
                  <input type="text" className="form-input-underline" placeholder="Ej: Casa 10" value={direccionForm.adicional} onChange={(e) => setDireccionForm({ ...direccionForm, adicional: e.target.value })} />
                </div>
                <div className="text-end">
                  <button type="submit" className={`btn-modal-continuar ${direccionForm.distrito && direccionForm.calle ? "active-ready" : ""}`}>
                    Continuar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
          {renderProductGrid(flashProducts)}
        </div>
      </section>

      <section className="container py-4 landing-product-sections">
        <ProductSectionHeader title="Los más pedidos" timeLeft={null} seeAllTo="/shop" />
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
          {renderProductGrid(
            popularProducts.length > 0
              ? popularProducts
              : featuredProducts.slice(0, 4),
          )}
        </div>
      </section>

      <div className="container-fluid px-0 landing-promo-ticker-wrap">
        <div className="landing-promo-ticker">
          <p className={`landing-promo-ticker-text${promoVisible ? " visible" : ""}`}>
            {ANUNCIOS_PROMO[promoIndex]}
          </p>
        </div>
      </div>

      <section className="container landing-newsletter-section">
        <div className="landing-newsletter">
          <i className="bi bi-bag landing-newsletter-deco" aria-hidden="true" />
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h3>Únete a nuestra comunidad</h3>
              <p>Recibe ofertas exclusivas, novedades y tips de compra directo en tu correo.</p>
            </div>
            <div className="col-lg-6">
              <form className="landing-newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="landing-newsletter-input"
                  placeholder="tu@correo.com"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-newsletter">Suscribirse</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-5 pt-3">
        <div className="garantia-wrapper">
          <div className="garantia-box p-4 rounded-4 shadow-sm d-flex align-items-start gap-3">
            <div className="garantia-icon-wrap">
              <i className="bi bi-shield-check" />
            </div>
            <div>
              <h4 className="garantia-title mb-1">Garantía de mejor precio</h4>
              <p className="garantia-desc">
                Si encuentras un precio más bajo, te devolvemos la diferencia. Compra con total seguridad.
              </p>
            </div>
          </div>
          <button type="button" className="garantia-chat-btn" aria-label="Abrir chat">
            <i className="bi bi-chat-square-text" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default MainContent;
