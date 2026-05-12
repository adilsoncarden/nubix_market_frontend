import React from "react";

const MainContent = () => {
    const productos = [
        { id: 1, nombre: "Manzanas 1kg", cat: "Frutas", precio: "5.90", tag: "Fresco", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3SQqGF9IzgWn-jF1AgCmORD0BgTnvX1JysA&s" },
        { id: 2, nombre: "Coca Cola 3L", cat: "Gaseosas", precio: "11.50", tag: "Popular", img: "https://dojiw2m9tvv09.cloudfront.net/53648/product/sintitulo2254.png" },
        { id: 3, nombre: "Leche Gloria 1L", cat: "Lácteos", precio: "5.20", tag: "Básico", img: "https://www.ofimarket.pe/cdn/shop/files/PR01963_600x600_crop_center.jpg?v=1682542692" },
        { id: 4, nombre: "Aceite Primor 900ml", cat: "Abarrotes", precio: "9.00", tag: "Oferta", img: "https://plazavea.vteximg.com.br/arquivos/ids/30632030-450-450/20281566.jpg?v=638758944609130000" },
    ];

    return (
        <main className="flex-grow-1 bg-light" style={{ marginTop: "-1px" }}>
            
            {/* 1. TU CARRUSEL RECUPERADO Y PERFECTO */}
            <section id="heroCarousel" className="carousel slide carousel-fade shadow-sm" data-bs-ride="carousel" style={{ backgroundColor: "#000" }}>
                <div className="carousel-inner" style={{ height: "550px" }}>
                    
                    {/* Slide 1 */}
                    <div className="carousel-item active h-100" data-bs-interval="5000">
                        <img
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop"
                            className="d-block w-100 h-100 object-fit-cover"
                            style={{ filter: "brightness(0.5)" }}
                            alt="Nubix Market"
                        />
                        <div className="carousel-caption d-flex flex-column justify-content-center h-100" style={{ top: "0", bottom: "0" }}>
                            <h1 className="display-3 fw-bold mb-3">Bienvenido a Nubix Market</h1>
                            <p className="fs-4 mb-4 opacity-90">Tu market de confianza, a un click de distancia</p>
                            <div><a href="/shop" className="btn btn-success btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg">Comprar ahora</a></div>
                        </div>
                    </div>

                    {/* Slide 2 */}
                    <div className="carousel-item h-100" data-bs-interval="5000">
                        <img
                            src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=1920&auto=format&fit=crop"
                            className="d-block w-100 h-100 object-fit-cover"
                            style={{ filter: "brightness(0.5)" }}
                            alt="Frutas Frescas"
                        />
                        <div className="carousel-caption d-flex flex-column justify-content-center h-100" style={{ top: "0", bottom: "0" }}>
                            <h1 className="display-3 fw-bold mb-3">Frescura Natural</h1>
                            <p className="fs-4 mb-4 opacity-90">Las mejores frutas seleccionadas para tu mesa</p>
                            <div><a href="/shop" className="btn btn-success btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg">Ver Frutas</a></div>
                        </div>
                    </div>

                    {/* Slide 3 */}
                    <div className="carousel-item h-100" data-bs-interval="5000">
                        <img
                            src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1920&auto=format&fit=crop"
                            className="d-block w-100 h-100 object-fit-cover"
                            style={{ filter: "brightness(0.5)" }}
                            alt="Abarrotes"
                        />
                        <div className="carousel-caption d-flex flex-column justify-content-center h-100" style={{ top: "0", bottom: "0" }}>
                            <h1 className="display-3 fw-bold mb-3">Todo para tu Hogar</h1>
                            <p className="fs-4 mb-4 opacity-90">Abarrotes de calidad con los mejores precios</p>
                            <div><a href="/shop" className="btn btn-success btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg">Ver Abarrotes</a></div>
                        </div>
                    </div>

                    {/* Slide 4 */}
                    <div className="carousel-item h-100" data-bs-interval="5000">
                        <img
                            src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1920&auto=format&fit=crop"
                            className="d-block w-100 h-100 object-fit-cover"
                            style={{ filter: "brightness(0.5)" }}
                            alt="Bebidas"
                        />
                        <div className="carousel-caption d-flex flex-column justify-content-center h-100" style={{ top: "0", bottom: "0" }}>
                            <h1 className="display-3 fw-bold mb-3">Refréscate con Nubix</h1>
                            <p className="fs-4 mb-4 opacity-90">Tus bebidas favoritas siempre heladas</p>
                            <div><a href="/shop" className="btn btn-success btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg">Ver Bebidas</a></div>
                        </div>
                    </div>
                </div>

                <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
            </section>

            {/* 2. BARRA DE BENEFICIOS (INNOVACIÓN) */}
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

            {/* 4. PRODUCTOS RECOMENDADOS (SÓLO 4) */}
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

            {/* 5. BANNER DE DESCUENTOS AL FINAL */}
            <section className="container pb-5">
                <div className="position-relative overflow-hidden rounded-5 shadow-lg bg-dark text-white p-5">
                    <div className="position-absolute top-0 end-0 opacity-25" style={{ transform: "translate(20%, -20%)" }}>
                        <i className="bi bi-lightning-charge display-1" style={{ fontSize: "15rem" }}></i>
                    </div>
                    
                    <div className="position-relative z-1">
                        <span className="badge bg-warning text-dark fw-bold mb-3 px-3 py-2">OFERTA IMPERDIBLE</span>
                        <h2 className="display-5 fw-bold mb-3">¡Descuentos cada semana! 🚀</h2>
                        <p className="fs-5 mb-4 opacity-75">Suscríbete o visítanos cada lunes para descubrir precios de locura en abarrotes.</p>
                        <button className="btn btn-success btn-lg rounded-pill px-5 fw-bold border-0 shadow">
                            Ver Ofertas de Hoy
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default MainContent;