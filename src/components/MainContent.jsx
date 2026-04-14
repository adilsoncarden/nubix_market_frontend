import React from "react";

const MainContent = () => {
    const productos = [
        {
            id: 1,
            nombre: "Manzanas 1kg",
            cat: "Frutas",
            precio: "5.90",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3SQqGF9IzgWn-jF1AgCmORD0BgTnvX1JysA&s",
        },
        {
            id: 2,
            nombre: "Coca Cola 3L",
            cat: "Gaseosas",
            precio: "11.50",
            img: "https://dojiw2m9tvv09.cloudfront.net/53648/product/sintitulo2254.png",
        },
        {
            id: 3,
            nombre: "Leche Entera UHT 1L Gloria",
            cat: "Lácteos",
            precio: "5.20",
            img: "https://www.ofimarket.pe/cdn/shop/files/PR01963_600x600_crop_center.jpg?v=1682542692",
        },
        {
            id: 4,
            nombre: "Aceite Vegetal Primor 900ml",
            cat: "Abarrotes",
            precio: "9.00",
            img: "https://plazavea.vteximg.com.br/arquivos/ids/30632030-450-450/20281566.jpg?v=638758944609130000",
        },
        {
            id: 5,
            nombre: "Sporade 1.5L",
            cat: "Bebidas Energetizantes",
            precio: "5.50",
            img: "https://plazavea.vteximg.com.br/arquivos/ids/29322631-450-450/20082646.jpg?v=638593275579170000",
        },
        {
            id: 6,
            nombre: "PIQUEO SNACKS Bolsa 190g",
            cat: "Snacks",
            precio: "2.20",
            img: "https://plazavea.vteximg.com.br/arquivos/ids/33033706-512-512/20179461.jpg",
        },
        {
            id: 7,
            nombre: "Detergente Marsella 730g",
            cat: "Limpieza del Hogar",
            precio: "7.00",
            img: "https://media.falabella.com/tottusPE/43498081_1/w=1500,h=1500,fit=cover",
        },
        {
            id: 8,
            nombre: "Shampoo Head & Shoulders 700ml",
            cat: "Cuidado Personal",
            precio: "35.00",
            img: "https://4msurtidos.com/cdn/shop/products/hsgrande.jpg?v=1593567736",
        },
    ];

    return (
        <main className="flex-grow-1 bg-white">
            <section
                className="position-relative overflow-hidden"
                style={{ height: "500px" }}
            >
                {" "}
                <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop"
                    className="w-100 h-100 object-fit-cover"
                    style={{ filter: "brightness(0.6)" }}
                    alt="Fresh Groceries"
                />
                <div className="position-absolute top-50 start-50 translate-middle text-center text-white w-100 px-3">
                    <h1 className="display-3 fw-bold mb-3">
                        Bienvenido a Nubix Market
                    </h1>
                    <p className="fs-4 mb-4 opacity-90">
                        Tu market de confianza, ahora a un click de distancia
                    </p>
                    <a
                        href="/shop"
                        className="btn btn-success btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg"
                    >
                        Comprar ahora <i className="bi bi-arrow-right ms-2"></i>
                    </a>
                </div>
            </section>

            <section className="container py-5">
                <h3 className="text-center fw-bold mb-5">
                    Comprar por Categoría
                </h3>
                <div className="row g-4 justify-content-center">
                    {[
                        { nombre: "Gaseosas", icono: "bi-cup-straw" },
                        { nombre: "Frutas", icono: "bi-apple" },
                        { nombre: "Lácteos", icono: "bi-egg-fried" },
                        { nombre: "Snacks", icono: "bi-cookie" },
                        { nombre: "Abarrotes", icono: "bi-box-seam" },
                        { nombre: "Bebidas", icono: "bi-droplet-half" },
                    ].map((item) => (
                        <div key={item.nombre} className="col-4 col-md-2">
                            <a
                                href={`/shop?category=${item.nombre}`}
                                className="card border-0 shadow-sm text-decoration-none text-center p-4 hover-card h-100"
                            >
                                <div
                                    className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style={{ width: "70px", height: "70px" }}
                                >
                                    <i
                                        className={`bi ${item.icono} text-success fs-2`}
                                    ></i>
                                </div>
                                <span className="fw-bold text-dark">
                                    {item.nombre}
                                </span>
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container pb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold m-0 text-dark">
                        Productos Recomendados
                    </h4>
                    <a
                        href="/shop"
                        className="btn btn-outline-success rounded-pill px-4 fw-bold"
                    >
                        Ver todo
                    </a>
                </div>

                <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {productos.map((p) => (
                        <div key={p.id} className="col">
                            <div className="card card-product-fixed border-0 shadow-sm rounded-4 overflow-hidden h-100">
                                <div
                                    className="img-container-fixed position-relative"
                                    style={{ height: "220px" }}
                                >
                                    {" "}
                                    <img
                                        src={p.img}
                                        alt={p.nombre}
                                        className="w-100 h-100 object-fit-cover"
                                    />
                                    <button
                                        className="btn btn-white btn-sm position-absolute top-0 end-0 m-3 rounded-circle shadow"
                                        style={{
                                            width: "35px",
                                            height: "35px",
                                        }}
                                    >
                                        <i className="bi bi-heart text-danger"></i>
                                    </button>
                                </div>

                                <div className="card-body p-3 d-flex flex-column">
                                    <small
                                        className="text-success fw-bold text-uppercase mb-1"
                                        style={{ fontSize: "0.75rem" }}
                                    >
                                        {p.cat}
                                    </small>
                                    <h6 className="fw-bold text-dark mb-2 fs-5">
                                        {p.nombre}
                                    </h6>

                                    <div className="d-flex justify-content-between align-items-center mt-auto pt-3">
                                        <span className="fs-5 fw-bold text-dark">
                                            S/ {p.precio}
                                        </span>
                                        <button className="btn btn-success rounded-3 px-3">
                                            <i className="bi bi-cart-plus-fill me-1"></i>{" "}
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default MainContent;
