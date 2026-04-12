import React from "react";

const MainContent = () => {
    const productos = [
        {
            id: 1,
            nombre: "Manzanas Rojas",
            cat: "Frutas",
            precio: "3.99",
            img: "https://images.unsplash.com/photo-1623815242959-fb20354f9b8d?w=500",
        },
        {
            id: 2,
            nombre: "Brócoli Fresco",
            cat: "Verduras",
            precio: "2.50",
            img: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=500",
        },
        {
            id: 3,
            nombre: "Leche Entera",
            cat: "Lácteos",
            precio: "1.20",
            img: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=500",
        },
        {
            id: 4,
            nombre: "Pan Artesanal",
            cat: "Panadería",
            precio: "2.10",
            img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
        },
        {
            id: 5,
            nombre: "Jugo Naranja",
            cat: "Bebidas",
            precio: "4.50",
            img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500",
        },
        {
            id: 6,
            nombre: "Plátanos",
            cat: "Frutas",
            precio: "1.50",
            img: "https://www.store2k.com/cdn/shop/products/banana_1024x.jpg?v=1682096489",
        },
        {
            id: 7,
            nombre: "Zanahorias",
            cat: "Verduras",
            precio: "0.90",
            img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500",
        },
        {
            id: 8,
            nombre: "Queso Fresco",
            cat: "Lácteos",
            precio: "5.50",
            img: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=500",
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
                        Abarrotes Frescos a Domicilio
                    </h1>
                    <p className="fs-4 mb-4 opacity-90">
                        Productos del campo, lácteos y básicos directamente a tu
                        puerta.
                    </p>
                    <a
                        href="/shop"
                        className="btn btn-success btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg"
                    >
                        Comprar Ahora <i className="bi bi-arrow-right ms-2"></i>
                    </a>
                </div>
            </section>

            <section className="container py-5">
                <h3 className="text-center fw-bold mb-5">
                    Comprar por Categoría
                </h3>
                <div className="row g-4 justify-content-center">
                    {[
                        "Frutas",
                        "Verduras",
                        "Lácteos",
                        "Snacks",
                        "Panadería",
                        "Bebidas",
                    ].map((category) => (
                        <div key={category} className="col-4 col-md-2">
                            <a
                                href={`/shop?category=${category}`}
                                className="card border-0 shadow-sm text-decoration-none text-center p-4 hover-card h-100"
                            >
                                <div
                                    className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style={{ width: "70px", height: "70px" }}
                                >
                                    <i className="bi bi-basket2-fill text-success fs-2"></i>
                                </div>
                                <span className="fw-bold text-dark">
                                    {category}
                                </span>
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container pb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold m-0 text-dark">
                        Productos Destacados
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
