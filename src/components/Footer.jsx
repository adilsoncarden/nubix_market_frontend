
import React, { useState } from "react";
import "../styles/landing.css";

const Footer = () => {
    // Estado para controlar la apertura del modal profesional
    const [showModal, setShowModal] = useState(false);
    
    // Estado para el formulario del libro de reclamaciones
    const [reclamacionData, setReclamacionData] = useState({
        nombre: "",
        documento: "",
        telefono: "",
        email: "",
        tipo: "Reclamación", // Reclamación o Queja
        detalle: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReclamacionData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitReclamacion = (e) => {
        e.preventDefault();
        // Aquí puedes conectar el envío a tu backend en Spring Boot más adelante
        alert("Su hoja de reclamación ha sido registrada con éxito. Nos comunicaremos con usted.");
        setShowModal(false);
        setReclamacionData({ nombre: "", documento: "", telefono: "", email: "", tipo: "Reclamación", detalle: "" });
    };

    return (
        <footer className="footer-landing pt-5 pb-4 mt-auto">
            <div className="container">
                <div className="row g-4 mb-4">
                    <div className="col-12 col-md-4">
                        <h6 className="mb-3 text-uppercase small">Empresa</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2">
                                <a href="/Nuestra_Empresa.pdf" download="Nuestra_Empresa.pdf" className="text-decoration-none">
                                    Nuestra empresa
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="/Venta_Empresa.pdf" download="Venta_Empresa.pdf" className="text-decoration-none">
                                    Venta Empresa
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="/Reporte_de_Sostenibilidad.pdf" download="Reporte_de_Sostenibilidad.pdf" className="text-decoration-none">
                                    Reportes Sostenibilidad
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="/DefensoriaDeVendedores.pdf" download="DefensoriaDeVendedores.pdf" className="text-decoration-none">
                                    Defensoría de Vendedores
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="col-6 col-md-4">
                        <h6 className="mb-3 text-uppercase small">Ayuda</h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2">
                                <a
                                    href="#!"
                                    className="text-decoration-none d-flex align-items-center"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowModal(true);
                                    }}
                                >
                                    <img
                                        src="https://tse2.mm.bing.net/th/id/OIP.t8Vj0oQ2RCIqq1_wbmas3wHaEG?pid=Api&P=0&h=180"
                                        alt="Libro de reclamaciones"
                                        className="me-2"
                                        style={{ width: "28px" }}
                                    />
                                    Libro de reclamaciones
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="/CONTACTANOS.pdf" download="CONTACTANOS.pdf" className="text-decoration-none">Contáctanos</a>
                            </li>
                            <li className="mb-2"><a href="#" className="text-decoration-none">Medios de pago</a></li>
                            <li className="mb-2"><a href="http://localhost:5173/register" className="text-decoration-none">Regístrate</a></li>
                            <li className="mb-2"><a href="http://localhost:5173/cart" className="text-decoration-none">Mis compras</a></li>
                        </ul>
                    </div>

                    <div className="col-6 col-md-4">
                        <h6 className="mb-3 text-uppercase small">Contacto</h6>
                        <div className="footer-contact-item">
                            <i className="bi bi-envelope" />
                            <span>contacto@nubixmarket.com</span>
                        </div>
                        <div className="footer-contact-item">
                            <i className="bi bi-telephone" />
                            <span>+51 999 000 000</span>
                        </div>
                        <div className="footer-contact-item">
                            <i className="bi bi-clock" />
                            <span>Lun – Dom: 8:00 a.m. – 10:00 p.m.</span>
                        </div>
                    </div>
                </div>

                <hr className="opacity-25 my-4" style={{ borderColor: "rgba(19, 77, 39, 0.15)" }} />

                <div className="row align-items-center">
                    <div className="col-md-4 d-flex gap-2 justify-content-center justify-content-md-start mb-3 mb-md-0">
                        <a href="https://www.facebook.com/profile.php?id=61589411142052" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            <div className="footer-social-circle"><i className="bi bi-facebook small" /></div>
                        </a>
                        <a href="https://www.instagram.com/nubixmarket1/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            <div className="footer-social-circle"><i className="bi bi-instagram small" /></div>
                        </a>
                        <a href="https://www.youtube.com/channel/UCF9sddEmsDpNI95cY2SmfKw" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            <div className="footer-social-circle"><i className="bi bi-youtube small" /></div>
                        </a>
                        <a href="https://x.com/NubixMarket" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            <div className="footer-social-circle"><i className="bi bi-twitter-x small" /></div>
                        </a>
                    </div>

                    <div className="col-md-8 text-center text-md-end">
                        <ul className="list-inline mb-0 small">
                            <li className="list-inline-item mx-2">
                                <a href="/Terminos_Y_Condiciones.pdf" download="Terminos_Y_Condiciones.pdf" className="text-decoration-none">
                                    Términos y condiciones
                                </a>
                            </li>
                            <li className="list-inline-item mx-2">
                                <a href="/POLITICA_DE_COOKIES.pdf" download="POLITICA_DE_COOKIES.pdf" className="text-decoration-none">
                                    Política de cookies
                                </a>
                            </li>
                            <li className="list-inline-item mx-2">
                                <a href="/POLITICA_DE_PRIVACIDAD.pdf" download="POLITICA_DE_PRIVACIDAD.pdf" className="text-decoration-none">
                                    Política de privacidad
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mt-4 pt-3 text-center text-md-start" style={{ borderTop: "1px solid rgba(19, 77, 39, 0.08)" }}>
                    <p className="mb-1 fw-semibold small" style={{ color: "#134d27", letterSpacing: "0.5px" }}>
                        © 2026 TODOS LOS DERECHOS RESERVADOS - NUBIX MARKET S.A.C.
                    </p>
                    <p className="mb-0 small text-muted">Lima, Perú.</p>
                </div>
            </div>

            {/* MODAL PROFESIONAL DEL LIBRO DE RECLAMACIONES */}
            {showModal && (
                <div 
                    className="modal d-block fade show" 
                    tabIndex="-1" 
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(4px)", zIndex: 1200 }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-md">
                        <div className="modal-content border-0 shadow-lg text-dark" style={{ borderRadius: "24px" }}>
                            
                            {/* Cabecera del Modal */}
                            <div className="modal-header border-0 pt-4 px-4 pb-2 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2">
                                    <img 
                                        src="https://tse2.mm.bing.net/th/id/OIP.t8Vj0oQ2RCIqq1_wbmas3wHaEG?pid=Api&P=0&h=180" 
                                        alt="Libro Reclamaciones" 
                                        style={{ width: "35px" }} 
                                    />
                                    <h5 className="modal-title fw-bold" style={{ fontSize: "1.25rem", color: "#1A1A1A" }}>
                                        Libro de Reclamaciones Virtual
                                    </h5>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn-close shadow-none" 
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>

                            {/* Cuerpo del Formulario */}
                            <form onSubmit={handleSubmitReclamacion}>
                                <div className="modal-body px-4 pb-4 pt-2" style={{ fontSize: "0.9rem" }}>
                                    <p className="text-muted mb-3" style={{ fontSize: "0.82rem" }}>
                                        Conforme a lo establecido en el Código de Protección y Defensa del Consumidor, Nubix Market pone a tu disposición este formulario.
                                    </p>

                                    {/* Campo: Nombre */}
                                    <div className="mb-2">
                                        <label className="form-label fw-semibold text-secondary mb-1">Nombre Completo</label>
                                        <input 
                                            type="text" 
                                            name="nombre"
                                            className="form-control border-0 py-2 px-3" 
                                            style={{ backgroundColor: "#F1F3F5", borderRadius: "12px", fontSize: "0.9rem" }}
                                            placeholder="" 
                                            value={reclamacionData.nombre}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>

                                    {/* Fila: DNI y Teléfono */}
                                    <div className="row g-2 mb-2">
                                        <div className="col-6">
                                            <label className="form-label fw-semibold text-secondary mb-1">DNI / CE</label>
                                            <input 
                                                type="text" 
                                                name="documento"
                                                className="form-control border-0 py-2 px-3" 
                                                style={{ backgroundColor: "#F1F3F5", borderRadius: "12px", fontSize: "0.9rem" }}
                                                placeholder="Documento" 
                                                value={reclamacionData.documento}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label fw-semibold text-secondary mb-1">Teléfono</label>
                                            <input 
                                                type="tel" 
                                                name="telefono"
                                                className="form-control border-0 py-2 px-3" 
                                                style={{ backgroundColor: "#F1F3F5", borderRadius: "12px", fontSize: "0.9rem" }}
                                                placeholder="999000999" 
                                                value={reclamacionData.telefono}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                    </div>

                                    {/* Campo: Correo */}
                                    <div className="mb-2">
                                        <label className="form-label fw-semibold text-secondary mb-1">Correo Electrónico</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            className="form-control border-0 py-2 px-3" 
                                            style={{ backgroundColor: "#F1F3F5", borderRadius: "12px", fontSize: "0.9rem" }}
                                            placeholder="correo@ejemplo.com" 
                                            value={reclamacionData.email}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>

                                    {/* Campo: Tipo de solicitud */}
                                    <div className="mb-2">
                                        <label className="form-label fw-semibold text-secondary mb-1">Tipo de Solicitud</label>
                                        <select 
                                            name="tipo"
                                            className="form-select border-0 py-2 px-3" 
                                            style={{ backgroundColor: "#F1F3F5", borderRadius: "12px", fontSize: "0.9rem" }}
                                            value={reclamacionData.tipo}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Reclamación">Reclamación (Disconformidad relacionada a los productos)</option>
                                            <option value="Queja">Queja (Disconformidad relacionada a la atención recibida)</option>
                                        </select>
                                    </div>

                                    {/* Campo: Detalle */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-secondary mb-1">Detalle del Reclamo o Queja</label>
                                        <textarea 
                                            name="detalle"
                                            className="form-control border-0 py-2 px-3" 
                                            rows="3" 
                                            style={{ backgroundColor: "#F1F3F5", borderRadius: "12px", fontSize: "0.9rem", resize: "none" }}
                                            placeholder="Describe detalladamente lo sucedido..." 
                                            value={reclamacionData.detalle}
                                            onChange={handleInputChange}
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Acciones del formulario */}
                                    <div className="d-flex gap-2 mt-4">
                                        <button 
                                            type="button" 
                                            className="btn w-50 fw-semibold" 
                                            style={{ backgroundColor: "#EAECEF", borderRadius: "20px", color: "#4A5568", border: "none" }}
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn w-50 fw-bold text-white" 
                                            style={{ backgroundColor: "#134d27", borderRadius: "20px", border: "none" }}
                                        >
                                            Enviar Reporte
                                        </button>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;