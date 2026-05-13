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

            {/* 3. CATEGORÍAS */}
            <section className="container py-5">
                <h3 className="fw-bold mb-4">Categorías Populares</h3>
                <div className="row g-3">
                    {[
                        { nombre: "Gaseosas", icono: "bi-cup-straw", color: "#e3f2fd" },
                        { nombre: "Frutas", icono: "bi-apple", color: "#f1f8e9" },
                        { nombre: "Lácteos", icono: "bi-egg-fried", color: "#fff3e0" },
                        { nombre: "Snacks", icono: "bi-cookie", color: "#fce4ec" },
                        { nombre: "Abarrotes", icono: "bi-box-seam", color: "#f3e5f5" },
                        { nombre: "Bebidas", icono: "bi-droplet-half", color: "#e0f2f1" },
                    ].map((item) => (
                        <div key={item.nombre} className="col-6 col-md-2">
                            <a href={`/shop?category=${item.nombre}`} className="card border-0 shadow-sm text-decoration-none text-center p-3 h-100 bg-white">
                                <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: "60px", height: "60px", backgroundColor: item.color }}>
                                    <i className={`bi ${item.icono} text-dark fs-3`}></i>
                                </div>
                                <span className="fw-bold text-dark small">{item.nombre}</span>
                            </a>
                        </div>
                    ))}
                </div>
            </section>

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
            </section>
        </main>
    );
};

export default MainContent;