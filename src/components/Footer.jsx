import React from "react";

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-5 pb-4 mt-auto" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="container">
                {/* SECCIÓN PRINCIPAL DE COLUMNAS */}
                <div className="row g-4 mb-5">
                    
                    {/* Columna 1: Servicio al Cliente */}
                    <div className="col-6 col-md-2">
                        <h6 className="fw-bold mb-3 text-uppercase small">Servicio al cliente</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2">
                                <a href="#" className="text-secondary text-decoration-none d-flex align-items-center">
                                    <img 
                                        src="https://tse2.mm.bing.net/th/id/OIP.t8Vj0oQ2RCIqq1_wbmas3wHaEG?pid=Api&P=0&h=180" 
                                        alt="Libro de reclamaciones" 
                                        className="me-2"
                                        style={{ width: '35px', filter: 'brightness(0.9)' }} 
                                    />
                                    Libro de reclamaciones
                                </a>
                            </li>
                            <li className="mb-2"> <a href="/CONTACTANOS.pdf" download="CONTACTANOS.pdf" className="text-secondary text-decoration-none">Contáctanos</a></li>
                            <li className="mb-2"><a href="#" className="text-secondary text-decoration-none">Medios de pago</a></li>
                        </ul>
                    </div>

                    {/* Columna 2: Mi Cuenta */}
                    <div className="col-6 col-md-2">
                        <h6 className="fw-bold mb-3 text-uppercase small">Mi cuenta</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2"><a href="http://localhost:5173/register" className="text-secondary text-decoration-none">Regístrate</a></li>
                            <li className="mb-2"><a href="#" className="text-secondary text-decoration-none">Cambiar contraseña</a></li>
                            <li className="mb-2"><a href="http://localhost:5173/cart" className="text-secondary text-decoration-none">Mis compras</a></li>
                        </ul>
                    </div>

                    {/* Columna 3: Destacados */}
                    <div className="col-6 col-md-2">
                        <h6 className="fw-bold mb-3 text-uppercase small">Destacados</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2"><a href="#" className="text-secondary text-decoration-none">Carnes</a></li>
                            <li className="mb-2"><a href="#" className="text-secondary text-decoration-none">Cervezas</a></li>
                            <li className="mb-2"><a href="#" className="text-secondary text-decoration-none">Cyber WOW</a></li>
                        </ul>
                    </div>

                    {/* Columna 4: Nuestra Empresa (CON DESCARGAS) */}
                    <div className="col-6 col-md-3">
                        <h6 className="fw-bold mb-3 text-uppercase small">Nuestra empresa</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2">
                                <a href="/Nuestra_Empresa.pdf" download="Nuestra_Empresa.pdf" className="text-secondary text-decoration-none">
                                    Nuestra empresa
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="/Venta_Empresa.pdf" download="Venta_Empresa.pdf" className="text-secondary text-decoration-none">
                                    Venta Empresa
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="/Reporte_de_Sostenibilidad.pdf" download="Reporte_de_Sostenibilidad.pdf" className="text-secondary text-decoration-none">
                                    Reportes Sostenibilidad
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="/DefensoriaDeVendedores.pdf" download="DefensoriaDeVendedores.pdf" className="text-secondary text-decoration-none">
                                    Defensoría de Vendedores
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 5: Nuestras redes (Texto) */}
                    <div className="col-6 col-md-3">
                        <h6 className="fw-bold mb-3 text-uppercase small">Nuestras redes</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2">
                                <a href="https://www.facebook.com/profile.php?id=61589411142052" target="_blank" rel="noopener noreferrer" className="text-secondary text-decoration-none">Facebook</a>
                            </li>
                            <li className="mb-2">
                                <a href="https://www.instagram.com/nubixmarket1/" target="_blank" rel="noopener noreferrer" className="text-secondary text-decoration-none">Instagram</a>
                            </li>
                            <li className="mb-2">
                                <a href="https://www.youtube.com/channel/UCF9sddEmsDpNI95cY2SmfKw" target="_blank" rel="noopener noreferrer" className="text-secondary text-decoration-none">Youtube</a>
                            </li>
                            <li className="mb-2">
                                <a href="https://x.com/NubixMarket" target="_blank" rel="noopener noreferrer" className="text-secondary text-decoration-none">X (Twitter)</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="border-secondary opacity-25 my-4" />

                {/* BARRA INFERIOR: ICONOS Y LEGALES */}
                <div className="row align-items-center">
                    {/* Iconos Redes */}
                    <div className="col-md-3 d-flex gap-2 justify-content-center justify-content-md-start mb-3 mb-md-0">
                        <a href="https://www.facebook.com/profile.php?id=61589411142052" target="_blank" className="text-decoration-none">
                            <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                <i className="bi bi-facebook text-white small"></i>
                            </div>
                        </a>
                        <a href="https://www.instagram.com/nubixmarket1/" target="_blank" className="text-decoration-none">
                            <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                <i className="bi bi-instagram text-white small"></i>
                            </div>
                        </a>
                        <a href="https://www.youtube.com/channel/UCF9sddEmsDpNI95cY2SmfKw" target="_blank" className="text-decoration-none">
                            <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                <i className="bi bi-youtube text-white small"></i>
                            </div>
                        </a>
                        <a href="https://x.com/NubixMarket" target="_blank" className="text-decoration-none">
                            <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                <i className="bi bi-twitter-x text-white small"></i>
                            </div>
                        </a>
                    </div>

                    {/* Enlaces Legales (ACTUALIZADOS PARA DESCARGA) */}
                    <div className="col-md-6 text-center"> 
                        <ul className="list-inline mb-0 small">
                            <li className="list-inline-item mx-2">
                                <a href="/Terminos_Y_Condiciones.pdf" download="Terminos_Y_Condiciones.pdf" className="text-secondary text-decoration-none">
                                    Términos y condiciones
                                </a>
                            </li>
                            <li className="list-inline-item mx-2">
                                <a href="/POLITICA_DE_COOKIES.pdf" download="POLITICA_DE_COOKIES.pdf" className="text-secondary text-decoration-none">
                                    Política de cookies
                                </a>
                            </li>
                            <li className="list-inline-item mx-2">
                                <a href="/POLITICA_DE_PRIVACIDAD.pdf" download="POLITICA_DE_PRIVACIDAD.pdf" className="text-secondary text-decoration-none">
                                    Política de privacidad
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="col-md-3 d-none d-md-block text-end">
                    </div>
                </div>

                {/* DIRECCIÓN Y DERECHOS */}
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-10 text-center text-md-start">
                    <p className="mb-1 text-secondary fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                        © 2026 TODOS LOS DERECHOS RESERVADOS - NUBIX MARKET S.A.C.
                    </p>
                    <p className="mb-0 text-secondary opacity-75" style={{ fontSize: '0.7rem' }}>
                         Lima, Perú.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;