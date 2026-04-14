import React from "react";

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-5 mt-auto">
            <div className="container">
                <div className="row g-4">
                    <div className="col-12 col-md-4">
                        <h5 className="fw-bold mb-3">Nubix Market</h5>
                        <p className="text-light small">
                            Digitalizando la experiencia de compra en Comas.<br />
                            Haz tu pedido online y recógelo sin colas con nuestro sistema Fast Line.
                        </p>
                    </div>

                    <div className="col-6 col-md-4">
                        <h5 className="fw-bold text-white mb-3">
                            Enlaces Rápidos
                        </h5>
                        <ul className="list-unstyled">
                            <li>
                                <a
                                    href="/"
                                    className="text-light text-decoration-none small"
                                >
                                    Inicio
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/shop"
                                    className="text-light text-decoration-none small"
                                >
                                    Tienda
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact"
                                    className="text-light text-decoration-none small"
                                >
                                    Contacto
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="col-6 col-md-4">
                        <h5 className="fw-bold text-white mb-3">Contacto</h5>
                        <p className="text-light small mb-1">
                            <i className="bi bi-envelope me-2"></i>{" "}
                            soporte@nubixmarket.com
                        </p>
                        <p className="text-light small">
                            <i className="bi bi-geo-alt me-2"></i> Calle San
                            Pedro, Comas
                        </p>
                    </div>
                </div>

                <hr className="my-4 border-secondary" />

                <div className="text-center text-white-50 small">
                    &copy; 2026 Nubix Market. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
