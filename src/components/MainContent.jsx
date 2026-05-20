
import React, { useEffect } from "react"; 
import { Carousel } from "bootstrap"; 
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
import { Link } from "react-router-dom";
import { useCart } from "../store/CartContext";

// Assets originales
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

const PRODUCTOS = [
  { id: 1, nombre: "Manzanas 1kg", cat: "Frutas", precio: 5.9, tag: "Fresco", tagColor: "tag-green", img: "https://media.tottus.com.pe/tottusPE/10161826_1/width=480,height=480,quality=70,format=webp,fit=pad" },
  { id: 2, nombre: "Coca Cola 3L", cat: "Gaseosas", precio: 11.5, tag: "Popular", tagColor: "tag-blue", img: "https://media.tottus.com.pe/tottusPE/10164192_1/width=480,height=480,quality=70,format=webp,fit=pad" },
  { id: 3, nombre: "Leche Gloria 1L", cat: "Lácteos", precio: 5.2, tag: "Básico", tagColor: "tag-yellow", img: "https://tse3.mm.bing.net/th/id/OIP.678KDktTo1zSZ8U1nvhGdAHaHa?pid=Api&P=0&h=180" },
  { id: 4, nombre: "Aceite Primor 900ml", cat: "Abarrotes", precio: 9.0, tag: "Oferta", tagColor: "tag-red", img: "https://media.tottus.com.pe/tottusPE/42757360_2/width=480,height=480,quality=70,format=webp,fit=pad" },
  { id: 5, nombre: "Papas Nativas 1kg", cat: "Frutas", precio: 4.5, tag: "Orgánico", tagColor: "tag-green", img: "https://media.tottus.com.pe/tottusPE/20014196_1/width=480,height=480,quality=70,format=webp,fit=pad" },
  { id: 6, nombre: "Detergente Ariel 2kg", cat: "Abarrotes", precio: 18.9, tag: "Limpieza", tagColor: "tag-blue", img: "https://tse1.mm.bing.net/th/id/OIP.wbp2VG1zCwldW2Fe2XY98wHaHa?pid=Api&P=0&h=180" },
  { id: 7, nombre: "Yogurt Griego 1kg", cat: "Lácteos", precio: 12.5, tag: "Saludable", tagColor: "tag-yellow", img: "https://media.falabella.com/tottusPE/42736718_1/w=1200,h=1200,fit=pad" },
  { id: 8, nombre: "Papas Lays Clásicas", cat: "Snacks", precio: 6.8, tag: "Crunchy", tagColor: "tag-red", img: "https://media.tottus.com.pe/tottusPE/43526445_2/width=480,height=480,quality=70,format=webp,fit=pad" },
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

        .promo-title-styled {
          font-family: 'Arial Black', sans-serif;
          font-size: 1.1rem;
          color: #fff;
          text-shadow: 2px 2px 0px rgba(0,0,0,0.3);
          font-style: italic;
          margin-bottom: 0;
        }

        /* AJUSTES PARA LAS IMÁGENES DE PRODUCTOS */
        .product-img-wrap {
          height: 180px;            /* Altura fija para que todas las cards sean iguales */
          display: flex;
          align-items: center;      /* Centrado vertical */
          justify-content: center;  /* Centrado horizontal */
          overflow: hidden;
          background-color: #fff;
          padding: 15px;            /* Espacio interno para que el producto no choque los bordes */
        }

        .product-img-wrap img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;      /* Mantiene la proporción sin recortar (soluciona Coca-Cola y Leche) */
        }

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

      {/* MARQUESINA PEQUEÑA */}
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
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${VERDE_NUBIX} 10%, rgba(40,167,69,0.3) 100%)` }}></div>
                  </div>
                  <div className="container position-relative" style={{ zIndex: 2 }}>
                    <div className="row align-items-center flex-nowrap g-0">
                      <div className="col-auto"><h2 className="mb-0 fw-black text-white promo-title-styled">{promo.titulo}</h2></div>
                      <div className="col-auto mx-3" style={{ height: '20px', width: '2px', backgroundColor: 'rgba(255,255,255,0.5)' }}></div>
                      <div className="col-auto"><p className="mb-0 fw-bold text-white text-uppercase" style={{ fontSize: '0.85rem' }}>{promo.sub}</p></div>
=======
import React from "react";
// Importaciones basadas en la estructura de carpetas de image_7fd31a.png
import bannerFrutas from "../assets/Banners/bannerFrutas.jpg";
import bannerLacteos from "../assets/Banners/bannerLacteos.jpg";
import bannerLimpieza from "../assets/Banners/bannerLimpieza.jpg";
import bannerPromos from "../assets/Banners/bannerPromos.jpg";
import bannerSnacks from "../assets/Banners/bannerSnacks.jpg";

const MainContent = () => {
    const productos = [
        { id: 1, nombre: "Manzanas 1kg", cat: "Frutas", precio: "5.90", tag: "Fresco", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3SQqGF9IzgWn-jF1AgCmORD0BgTnvX1JysA&s" },
        { id: 2, nombre: "Coca Cola 3L", cat: "Gaseosas", precio: "11.50", tag: "Popular", img: "https://dojiw2m9tvv09.cloudfront.net/53648/product/sintitulo2254.png" },
        { id: 3, nombre: "Leche Gloria 1L", cat: "Lácteos", precio: "5.20", tag: "Básico", img: "https://www.ofimarket.pe/cdn/shop/files/PR01963_600x600_crop_center.jpg?v=1682542692" },
        { id: 4, nombre: "Aceite Primor 900ml", cat: "Abarrotes", precio: "9.00", tag: "Oferta", img: "https://plazavea.vteximg.com.br/arquivos/ids/30632030-450-450/20281566.jpg?v=638758944609130000" },
    ];

    const banners = [
        { img: bannerPromos, alt: "Promociones Nubix" },
        { img: bannerLacteos, alt: "Lácteos" },
        { img: bannerSnacks, alt: "Snacks" },
        { img: bannerLimpieza, alt: "Limpieza" },
        { img: bannerFrutas, alt: "Frutas" }
    ];

    return (
        <main className="flex-grow-1 bg-light">
            
            {/* --- TOP INFO BARS --- */}
            <div className="container-fluid p-0">
                <div className="d-flex align-items-center justify-content-center py-2 px-3" style={{ backgroundColor: "#d9e96a", color: "#1b4d3e" }}>
                    <div className="d-flex align-items-center flex-wrap justify-content-center">
                        <i className="bi bi-truck mt-1 me-2 fs-5"></i>
                        <span className="fw-bold text-uppercase me-2">Envío Gratis</span>
                        <span className="me-2">por compras mayores a</span>
                        <span className="badge rounded-pill bg-white text-dark fw-bold px-3 py-1 shadow-sm" style={{ fontSize: "0.9rem" }}>S/ 180</span>
                        <span className="ms-2 d-none d-md-inline">en supermercado *Ver T&C</span>
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-center py-2 px-3 bg-success text-white">
                    <div className="d-flex align-items-center flex-wrap justify-content-center text-center">
                        <span className="me-2">Compra <strong>HOY</strong> y paga después con tu</span>
                        <span className="bg-white text-success fw-bold px-2 py-0 rounded mx-2">TARJETA NUBIX</span>
                        <span className="fw-bold border border-white px-2 rounded me-2">SIN INTERESES</span>
                        <span className="small opacity-75 d-none d-lg-inline">En todo electro, hogar y vestuario</span>
                    </div>
                </div>
            </div>

            {/* 1. CARRUSEL */}
            <section className="container-fluid p-0 overflow-hidden shadow-sm" style={{ borderBottomLeftRadius: '50px', borderBottomRightRadius: '50px', backgroundColor: '#fff' }}>
                <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {banners.map((_, index) => (
                            <button 
                                key={index}
                                type="button" 
                                data-bs-target="#heroCarousel" 
                                data-bs-slide-to={index} 
                                className={index === 0 ? "active" : ""}
                                style={{ backgroundColor: "#198754", width: '12px', height: '12px', borderRadius: '50%' }}
                            ></button>
                        ))}
                    </div>

                    <div className="carousel-inner">
                        {banners.map((banner, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`} data-bs-interval="4000">
                                <img
                                    src={banner.img}
                                    className="d-block w-100"
                                    style={{ 
                                        height: "auto",
                                        maxHeight: "600px", 
                                        objectFit: "contain",
                                        backgroundColor: "#f8f9fa"
                                    }}
                                    alt={banner.alt}
                                />
                            </div>
                        ))}
                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true" style={{ backgroundSize: '50%' }}></span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true" style={{ backgroundSize: '50%' }}></span>
                    </button>
                </div>
            </section>

            {/* 2. BARRA DE BENEFICIOS */}
            <div className="bg-white py-4 shadow-sm border-bottom">
                <div className="container">
                    <div className="row text-center g-4">
                        <div className="col-md-3">
                            <i className="bi bi-truck text-success fs-3"></i>
                            <h6 className="fw-bold mt-2 mb-0">Envío Rápido</h6>
                            <small className="text-muted">Directo a tu casa</small>
                        </div>
                        <div className="col-md-3">
                            <i className="bi bi-shield-check text-success fs-3"></i>
                            <h6 className="fw-bold mt-2 mb-0">Pago Seguro</h6>
                            <small className="text-muted">Transacciones protegidas</small>
                        </div>
                        <div className="col-md-3">
                            <i className="bi bi-star text-success fs-3"></i>
                            <h6 className="fw-bold mt-2 mb-0">Calidad Nubix</h6>
                            <small className="text-muted">Productos seleccionados</small>
                        </div>
                        <div className="col-md-3">
                            <i className="bi bi-chat-dots text-success fs-3"></i>
                            <h6 className="fw-bold mt-2 mb-0">Atención Personalizada</h6>
                            <small className="text-muted">Soporte inmediato</small>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HERO CARRUSEL GRANDE */}
      <section id="heroCarousel" className="carousel slide carousel-fade">
        <div className="carousel-indicators">
          {SLIDES_FIXED.map((_, i) => (
            <button key={i} type="button" data-bs-target="#heroCarousel" data-bs-slide-to={i} className={i === 0 ? "active" : ""}></button>
          ))}
        </div>
        <div className="carousel-inner hero-inner">
          {SLIDES_FIXED.map((s, i) => (
            <div key={i} className={`carousel-item h-100 ${i === 0 ? "active" : ""}`}>
              <Link to={s.to}><img src={s.img} className="hero-img d-block w-100 h-100" alt="slide" /></Link>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev"><span className="carousel-control-prev-icon"></span></button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next"><span className="carousel-control-next-icon"></span></button>
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

      {/* COLLAGE */}
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
=======
            {/* 4. PRODUCTOS RECOMENDADOS */}
            <section className="container pb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold m-0 text-dark">Top Seleccionados</h4>
                    <a href="/shop" className="text-success fw-bold text-decoration-none small">Ver todos →</a>
                </div>
                <div className="row row-cols-2 row-cols-md-4 g-4">
                    {productos.map((p) => (
                        <div key={p.id} className="col">
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 position-relative">
                                <span className="position-absolute top-0 start-0 m-2 badge rounded-pill bg-danger shadow-sm">
                                    {p.tag}
                                </span>
                                <div style={{ height: "180px" }}>
                                    <img src={p.img} alt={p.nombre} className="w-100 h-100 object-fit-cover" />
                                </div>
                                <div className="card-body p-3">
                                    <h6 className="fw-bold text-dark text-truncate mb-1">{p.nombre}</h6>
                                    <p className="text-muted small mb-2">{p.cat}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold text-success fs-5">S/ {p.precio}</span>
                                        <button className="btn btn-outline-success btn-sm rounded-circle">
                                            <i className="bi bi-plus-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SECCIÓN WOW: STATS & TESTIMONIOS --- */}
            <section className="py-5" style={{ backgroundColor: "#1b4d3e" }}>
                <div className="container text-white">
                    <div className="row text-center mb-5">
                        <div className="col-md-4">
                            <h2 className="fw-bold display-4">+10k</h2>
                            <p className="opacity-75">Pedidos Entregados</p>
                        </div>
                        <div className="col-md-4 border-start border-end border-white border-opacity-25">
                            <h2 className="fw-bold display-4">4.9/5</h2>
                            <p className="opacity-75">Satisfacción Real</p>
                        </div>
                        <div className="col-md-4">
                            <h2 className="fw-bold display-4">30 min</h2>
                            <p className="opacity-75">Tiempo Promedio</p>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            { nombre: "María R.", texto: "Nubix Market me salva las cenas. Todo llega fresquísimo.", avatar: "MR" },
                            { nombre: "Juan C.", texto: "La facilidad de pago sin intereses es lo mejor que han sacado.", avatar: "JC" }
                        ].map((t, i) => (
                            <div key={i} className="col-md-6">
                                <div className="bg-white text-dark p-4 rounded-4 shadow-sm h-100 d-flex align-items-start gap-3">
                                    <div className="bg-success rounded-circle p-3 text-white fw-bold">{t.avatar}</div>
                                    <div>
                                        <div className="text-warning mb-2">
                                            <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                                        </div>
                                        <p className="fst-italic mb-1">"{t.texto}"</p>
                                        <small className="fw-bold text-muted">- {t.nombre}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. BANNER FINAL */}
            <section className="container py-5">
                <div className="position-relative overflow-hidden rounded-5 shadow-lg bg-dark text-white p-5">
                    <div className="position-absolute top-0 end-0 opacity-25" style={{ transform: "translate(20%, -20%)" }}>
                        <i className="bi bi-lightning-charge display-1" style={{ fontSize: "15rem" }}></i>
                    </div>
                    <div className="position-relative z-1">
                        <span className="badge bg-warning text-dark fw-bold mb-3 px-3 py-2 text-uppercase">Exclusivo en Web</span>
                        <h2 className="display-5 fw-bold mb-3">¡Nuevos ingresos cada lunes! 🚀</h2>
                        <p className="fs-5 mb-4 opacity-75">Sé el primero en comprar lo más fresco de la temporada directo de nuestros productores locales.</p>
                        <button className="btn btn-success btn-lg rounded-pill px-5 fw-bold border-0 shadow">
                            Explorar Novedades
                        </button>
                    </div>
                </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="collage-sub-card bg-3d-green shadow-lg">
                <div className="text-3d-front text-white"><h4 className="fw-bold">10% DE AHORRO EN TU PRIMERA COMPRA</h4></div>
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" className="blob-frame" alt="promo1" />
                <div className="text-3d-front d-flex justify-content-between align-items-center">
                    <span className="text-white-50 small">Regístrate hoy para tu primer pedido.</span>
                    <button className="btn-go-black"><i className="bi bi-chevron-right"></i></button>
                </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="collage-sub-card bg-3d-pink shadow-lg">
                <div className="text-3d-front" style={{color: '#880e4f'}}><h4 className="fw-bold">ENVÍO GRATIS POR COMPRAS MAYORES A 100 SOLES</h4></div>
                <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600" className="blob-frame" alt="promo2" />
                <div className="text-3d-front d-flex justify-content-between align-items-center">
                    <span className="small" style={{color: '#880e4f'}}>Abastece tu despensa sin costo extra.</span>
                    <button className="btn-go-black"><i className="bi bi-chevron-right"></i></button>
                </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="collage-sub-card bg-3d-yellow shadow-lg">
                <div className="text-3d-front" style={{color: '#333'}}><h4 className="fw-bold">PRODUCTOS DE LA MEJOR CALIDAD</h4></div>
                <img src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80" className="blob-frame" alt="Tienda Market" />
                <div className="text-3d-front d-flex justify-content-between align-items-center">
                    <span className="small" style={{color: '#333'}}>Lo mejor del mercado directo a tu mesa.</span>
                    <button className="btn-go-black text-white"><i className="bi bi-chevron-right"></i></button>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP SELECCIONADOS */}
      <section className="container py-5">
        <h3 className="section-title mb-4 fw-bold">Top Seleccionados</h3>
        <div className="row row-cols-2 row-cols-md-4 g-4">
          {PRODUCTOS.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
      
    </div>
  );
};

export default MainContent;