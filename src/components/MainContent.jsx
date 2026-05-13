import React, { useEffect } from "react"; 
import { Carousel } from "bootstrap"; 
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
import { Link } from "react-router-dom";
import { useCart } from "../store/CartContext";

// Assets originales preservados
import slide1 from "../assets/imagen1.png";
import slide2 from "../assets/imagen2.png";
import slide3 from "../assets/imagen3.png";
import slide4 from "../assets/imagen4.png";
import slide5 from "../assets/imagen5.png";
import slide6 from "../assets/imagen6.png";

const PROMOCIONES_TOP = [
  { titulo: "¡OFERTAS DE INFARTO!", sub: "Llevate 3 y paga 2 en abarrotes", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80" },
  { titulo: "DELIVERY GRATIS", sub: "Por compras mayores a S/ 100", img: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1600&q=80" },
  { titulo: "NUBIX MARKET", sub: "Calidad y frescura garantizada", img: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1600&q=80" },
  { titulo: "CUIDADO PERSONAL", sub: "20% DSCTO en desodorantes", img: "https://images.unsplash.com/photo-1556229167-73191139ac06?w=1600&q=80" },
  { titulo: "ZONA LIMPIEZA", sub: "Todo para tu hogar aquí", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=80" },
  { titulo: "MUNDO MASCOTAS", sub: "Croquetas con 15% de descuento", img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1600&q=80" }
];

export const CATEGORIAS_DATA = [
  { nombre: "Gaseosas",   img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&q=80", color: "#e3f2fd", text: "#1565c0" },
  { nombre: "Frutas",    img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&q=80", color: "#f1f8e9", text: "#2e7d32" },
  { nombre: "Lácteos",   img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80", color: "#fff3e0", text: "#e65100" },
  { nombre: "Snacks",    img: "https://images.unsplash.com/photo-1599490659223-930b44c027f9?w=200&q=80", color: "#fce4ec", text: "#c62828" },
  { nombre: "Abarrotes", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80", color: "#f3e5f5", text: "#6a1b9a" },
  { nombre: "Bebidas",   img: "https://images.unsplash.com/photo-1544145945-f904253d0c7b?w=200&q=80", color: "#e0f2f1", text: "#00695c" },
];

const SLIDES_FIXED = [
  { img: slide1, to: "/shop" },
  { img: slide2, to: "/shop?category=Frutas" },
  { img: slide3, to: "/shop?category=Abarrotes" },
  { img: slide4, to: "/shop?category=Bebidas" },
  { img: slide5, to: "/shop?category=Snacks" },
  { img: slide6, to: "/shop?category=Lácteos" },
];

const PRODUCTOS = [
  { id: 1, nombre: "Manzanas 1kg", cat: "Frutas", precio: 5.9, tag: "Fresco", tagColor: "tag-green", img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80" },
  { id: 2, nombre: "Coca Cola 3L", cat: "Gaseosas", precio: 11.5, tag: "Popular", tagColor: "tag-blue", img: "https://images.unsplash.com/photo-1554866624-95def341-bab2?w=400&q=80" },
  { id: 3, nombre: "Leche Gloria 1L", cat: "Lácteos", precio: 5.2, tag: "Básico", tagColor: "tag-yellow", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80" },
  { id: 4, nombre: "Aceite Primor 900ml", cat: "Abarrotes", precio: 9.0, tag: "Oferta", tagColor: "tag-red", img: "https://images.unsplash.com/photo-1474979220686-9a1d73e2fe6f?w=400&q=80" },
];

const BENEFICIOS = [
  { icono: "bi-truck", titulo: "Envio Rapido", sub: "Directo a tu casa" },
  { icono: "bi-shield-check", titulo: "Pago Seguro", sub: "Transacciones protegidas" },
  { icono: "bi-star", titulo: "Calidad Nubix", sub: "Productos seleccionados" },
  { icono: "bi-chat-dots", titulo: "Soporte Inmediato", sub: "Atencion personalizada" },
];

const ProductCard = ({ p }) => {
  const { addToCart } = useCart();
  return (
    <div className="col">
      <div className="product-card card border-0 h-100 rounded-4 overflow-hidden shadow-sm">
        {p.tag && <span className={`product-tag ${p.tagColor}`}>{p.tag}</span>}
        <div className="product-img-wrap"><img src={p.img} alt={p.nombre} /></div>
        <div className="card-body p-3 d-flex flex-column">
          <p className="product-cat mb-1">{p.cat}</p>
          <h6 className="product-name mb-2">{p.nombre}</h6>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className="product-price">S/ {p.precio.toFixed(2)}</span>
            <button className="btn-add-cart" onClick={() => addToCart({ ...p, name: p.nombre, price: p.precio })}><i className="bi bi-cart-plus"></i></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryCard = ({ item }) => (
  <div className="col-4 col-md-2">
    <Link to={`/shop?category=${item.nombre}`} className="category-card text-decoration-none d-block text-center p-3 rounded-4 bg-white shadow-sm">
      <div className="cat-icon-wrap mx-auto mb-2" style={{ background: item.color, overflow: 'hidden' }}>
        <img src={item.img} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
      </div>
      <span className="cat-label" style={{ color: item.text, fontWeight: '600' }}>{item.nombre}</span>
    </Link>
  </div>
);

const MainContent = () => {
  useEffect(() => {
    const mainEl = document.querySelector('#heroCarousel');
    if (mainEl) {
      new Carousel(mainEl, { interval: 8000, pause: false, ride: 'carousel' });
    }
  }, []);

  const VERDE_NUBIX = "#28a745";

  return (
    <div>
      <style>{`
        .track-container { overflow: hidden; width: 100%; height: 50px; background: ${VERDE_NUBIX}; position: relative; }
        .track-content { display: flex; width: max-content; animation: scrollRight 40s linear infinite; }
        .track-item { flex: 0 0 auto; width: 100vw; }
        @keyframes scrollRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

        .collage-main-card {
            background: radial-gradient(circle at center, #ffffff 0%, #e3f2fd 100%) !important;
            border-radius: 40px;
            min-height: 400px;
            position: relative;
        }

        .collage-sub-card {
            border-radius: 40px;
            height: 450px;
            position: relative;
            overflow: hidden;
            padding: 35px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .blob-frame {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 75%;
            height: 55%;
            object-fit: cover;
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            animation: morphing 10s infinite alternate ease-in-out;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            z-index: 5;
        }

        @keyframes morphing {
          0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
          100% { border-radius: 64% 36% 70% 30% / 30% 59% 41% 70%; }
        }

        .bg-3d-green { background: radial-gradient(circle at top left, #1b4d3e 0%, #0d2b22 100%) !important; }
        .bg-3d-pink { background: radial-gradient(circle at top left, #fce4ec 0%, #f06292 100%) !important; }
        .bg-3d-yellow { background: radial-gradient(circle at top left, #fffde7 0%, #fdd835 100%) !important; }

        .text-3d-front { position: relative; z-index: 10; }
        .btn-go-black { width: 45px; height: 45px; background: #000; color: #fff; border-radius: 50%; border: none; z-index: 10; }
      `}</style>

      {/* MARQUESINA */}
      <div className="container-fluid px-0">
        <div className="track-container">
          <div className="track-content">
            {[...PROMOCIONES_TOP, ...PROMOCIONES_TOP].map((promo, index) => (
              <div key={index} className="track-item">
                <div className="d-flex align-items-center position-relative overflow-hidden" style={{ height: "50px", backgroundColor: VERDE_NUBIX }}>
                  <div style={{
                    position: 'absolute', right: 0, top: 0, bottom: 0, width: '60%',
                    backgroundImage: `url(${promo.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)', zIndex: 1
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${VERDE_NUBIX} 10%, rgba(0,0,0,0) 100%)` }}></div>
                  </div>
                  <div className="container position-relative" style={{ zIndex: 2 }}>
                    <div className="row align-items-center flex-nowrap g-0">
                      <div className="col-auto"><h2 className="mb-0 fw-black text-white italic" style={{ fontSize: '1rem' }}>{promo.titulo}</h2></div>
                      <div className="col-auto mx-3" style={{ height: '20px', width: '2px', backgroundColor: 'rgba(255,255,255,0.5)' }}></div>
                      <div className="col-auto"><p className="mb-0 fw-bold text-white text-uppercase" style={{ fontSize: '0.8rem' }}>{promo.sub}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HERO CARRUSEL ACTUALIZADO CON FLECHAS E INDICADORES */}
      <section id="heroCarousel" className="carousel slide carousel-fade">
        <div className="carousel-indicators">
          {SLIDES_FIXED.map((_, i) => (
            <button
              key={i}
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to={i}
              className={i === 0 ? "active" : ""}
              aria-current={i === 0 ? "true" : "false"}
              aria-label={`Slide ${i + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner hero-inner">
          {SLIDES_FIXED.map((s, i) => (
            <div key={i} className={`carousel-item h-100 ${i === 0 ? "active" : ""}`}>
              <Link to={s.to}><img src={s.img} className="hero-img d-block w-100 h-100" alt="slide" /></Link>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </section>

      {/* BENEFICIOS */}
      <div className="benefits-bar py-4">
        <div className="container">
          <div className="row g-3 text-center">
            {BENEFICIOS.map((b) => (
              <div key={b.titulo} className="col-6 col-md-3">
                <i className={`bi ${b.icono} benefit-icon mb-2 d-block fs-2`}></i>
                <p className="benefit-title mb-0 fw-bold">{b.titulo}</p>
                <small className="benefit-sub text-muted">{b.sub}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORÍAS */}
      <section className="container py-5">
        <h3 className="section-title mb-4 fw-bold">Categorías Populares</h3>
        <div className="row g-3">
          {CATEGORIAS_DATA.map((item) => <CategoryCard key={item.nombre} item={item} />)}
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="container py-5">
        <h3 className="section-title mb-4 fw-bold">Top Seleccionados</h3>
        <div className="row row-cols-2 row-cols-md-4 g-4">
          {PRODUCTOS.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* SECCIÓN COLLAGE */}
      <section className="container py-5">
        <div className="row g-4">
          
          <div className="col-12">
            <div className="collage-main-card d-flex align-items-center p-5 shadow-lg overflow-hidden">
                <div className="row w-100 align-items-center">
                    <div className="col-md-6 text-center d-none d-md-block position-relative" style={{height: '300px'}}>
                        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" className="blob-frame" alt="Fresh" />
                    </div>
                    <div className="col-md-6">
                        <h1 className="fw-black display-4 mb-3" style={{color: '#0d2b22'}}>Frutas y Verduras.<br/>Entrega Diaria.</h1>
                        <p className="text-muted fs-5 mb-4">La mejor calidad seleccionada para tu hogar.</p>
                        <Link to="/shop" className="btn btn-dark rounded-pill px-5 py-3 fw-bold">Comprar Ahora</Link>
                    </div>
                </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="collage-sub-card bg-3d-green shadow-lg">
                <div className="text-3d-front text-white">
                    <h4 className="fw-bold">10% DE AHORRO EN TU PRIMERA COMPRA</h4>
                </div>
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" className="blob-frame" alt="promo1" />
                <div className="text-3d-front d-flex justify-content-between align-items-center">
                    <span className="text-white-50 small">Regístrate hoy para tu primer pedido.</span>
                    <button className="btn-go-black"><i className="bi bi-chevron-right"></i></button>
                </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="collage-sub-card bg-3d-pink shadow-lg">
                <div className="text-3d-front" style={{color: '#880e4f'}}>
                    <h4 className="fw-bold">ENVÍO GRATIS POR COMPRAS MAYORES A 100 SOLES</h4>
                </div>
                <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600" className="blob-frame" alt="promo2" />
                <div className="text-3d-front d-flex justify-content-between align-items-center">
                    <span className="small" style={{color: '#880e4f'}}>Abastece tu despensa sin costo extra.</span>
                    <button className="btn-go-black"><i className="bi bi-chevron-right"></i></button>
                </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="collage-sub-card bg-3d-yellow shadow-lg">
                <div className="text-3d-front" style={{color: '#333'}}>
                    <h4 className="fw-bold">PRODUCTOS DE LA MEJOR CALIDAD</h4>
                </div>
                <img src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80" className="blob-frame" alt="Tienda Market" />
                <div className="text-3d-front d-flex justify-content-between align-items-center">
                    <span className="small" style={{color: '#333'}}>Lo mejor del mercado directo a tu mesa.</span>
                    <button className="btn-go-black text-white"><i className="bi bi-chevron-right"></i></button>
                </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default MainContent;