import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";

const Navbar = () => {
    // --- CONFIGURACIÓN DE COLOR RÁPIDA ---
    // Verde llamativo: #2ecc71 (Esmeralda), #27ae60 (Verde fuerte), #16a085 (Turquesa oscuro)
    const colorFondo = "#27ae60"; 
    const textoColor = "#ffffff"; // Color de letras del navbar (blanco para que resalte)
    // -------------------------------------

    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState(
        () => localStorage.getItem("username") || "",
    );
    
    const [showMegaMenu, setShowMegaMenu] = useState(false);
    const [activeCat, setActiveCat] = useState("Abarrotes");

    const categoriasData = {
        "Abarrotes": [
            { titulo: "Arroz y Menestras", items: ["Arroz Extra", "Lentejas", "Frijol Canario", "Garbanzos"] },
            { titulo: "Aceites y Pastas", items: ["Aceite Vegetal", "Aceite de Oliva", "Tallarines", "Fideos Cortos"] },
            { titulo: "Conservas", items: ["Atún en trozos", "Duraznos en conserva", "Menestras listas"] }
        ],
        "Lácteos y Quesos": [
            { titulo: "Leches", items: ["Leche Evaporada", "Leche Fresca", "Leche de Almendras"] },
            { titulo: "Quesos", items: ["Queso Edam", "Queso Fresco", "Queso Parmesano"] },
            { titulo: "Yogures", items: ["Yogur Griego", "Yogur de Fresa", "Bebible"] }
        ],
        "Frutas y Verduras": [
            { titulo: "Verduras", items: ["Cebolla Roja", "Tomate Buganvilla", "Espinaca", "Zanahoria"] },
            { titulo: "Frutas", items: ["Plátano de Seda", "Manzana Delicia", "Mandarina", "Palta Hass"] }
        ],
        "Carnes y Aves": [
            { titulo: "Pollo", items: ["Pollo Entero", "Pechuga de Pollo", "Alitas"] },
            { titulo: "Res", items: ["Bistec de Cadera", "Carne Molida", "Asado de Tira"] },
            { titulo: "Cerdo", items: ["Chuletas", "Panceta", "Tocino"] }
        ],
        "Limpieza": [
            { titulo: "Cuidado del Hogar", items: ["Detergente en polvo", "Lavavajillas", "Desinfectante"] },
            { titulo: "Papelería", items: ["Papel Higiénico", "Papel Toalla", "Servilletas"] }
        ],
        "Bebidas": [
            { titulo: "Aguas y Gaseosas", items: ["Agua Mineral", "Gaseosa Cola", "Gaseosa Lima Limón"] },
            { titulo: "Jugos", items: ["Jugo de Naranja", "Jugo de Piña", "Refrescos"] }
        ],
        "Mascotas": [
            { titulo: "Perros", items: ["Comida Seca", "Snacks", "Juguetes"] },
            { titulo: "Gatos", items: ["Arena Sanitaria", "Comida Húmeda", "Rascadores"] }
        ]
    };

    useEffect(() => {
        const handleStorage = () => setUsername(localStorage.getItem("username") || "");
        window.addEventListener("storage", handleStorage);
        window.addEventListener("localStorageChanged", handleStorage);
        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("localStorageChanged", handleStorage);
        };
    }, []);

    useEffect(() => {
        setUsername(localStorage.getItem("username") || "");
        setShowMegaMenu(false);
    }, [location]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUsername("");
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg sticky-top shadow-sm py-2" style={{ backgroundColor: colorFondo }}>
            <div className="container-fluid px-4">
                
                <div className="d-flex align-items-center">
                    <a className="navbar-brand d-flex align-items-center m-0" href="/">
                        <img src={logoImage} alt="Logo" style={{ height: "55px", width: "auto", filter: "brightness(1.1)" }} />
                    </a>

                    <button 
                        className="btn border-0 d-flex align-items-center gap-2 ms-5 px-0"
                        onClick={() => setShowMegaMenu(!showMegaMenu)}
                        style={{ fontWeight: "600", fontSize: "0.95rem", color: textoColor }}
                    >
                        Categorías
                        <i className={`bi ${showMegaMenu ? 'bi-chevron-up' : 'bi-chevron-down'}`} style={{ fontSize: "0.8rem" }}></i>
                    </button>
                </div>

                {/* Barra de Búsqueda con fondo blanco para que resalte */}
                <div className="flex-grow-1 mx-4 d-none d-lg-block" style={{ maxWidth: "500px" }}>
                    <div className="input-group position-relative">
                        <input 
                            type="text" 
                            className="form-control rounded-pill ps-4 py-2 border-0 shadow-sm" 
                            placeholder="¿Qué buscas en Nubix Market?" 
                            style={{ fontSize: "0.95rem" }} 
                        />
                        <button className="btn btn-dark rounded-circle position-absolute end-0 top-50 translate-middle-y me-1 d-flex align-items-center justify-content-center" style={{ width: "34px", height: "34px", zIndex: 5 }}>
                            <i className="bi bi-search" style={{ fontSize: "0.85rem" }}></i>
                        </button>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <div className="d-none d-md-flex gap-3 me-2">
                        <a className="text-decoration-none fw-semibold small" href="/" style={{ color: textoColor }}>Inicio</a>
                        <a className="text-decoration-none fw-semibold small" href="/shop" style={{ color: textoColor }}>Tienda</a>
                    </div>
                    <div className="vr d-none d-md-block mx-2 bg-white" style={{ height: "30px", opacity: 0.5 }}></div>
                    
                    {username ? (
                        <div className="dropdown">
                            <button className="btn d-flex align-items-center gap-2 border-0 bg-transparent p-0" data-bs-toggle="dropdown">
                                <div className="bg-white bg-opacity-20 rounded-circle p-2"><i className="bi bi-person" style={{ color: textoColor }}></i></div>
                                <div className="text-start d-none d-sm-block">
                                    <p className="m-0 small opacity-75 lh-1" style={{ color: textoColor }}>Hola,</p>
                                    <p className="m-0 fw-bold small" style={{ color: textoColor }}>{username}</p>
                                </div>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                <li><button className="dropdown-item py-2" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión</button></li>
                            </ul>
                        </div>
                    ) : (
                        <a className="text-decoration-none d-flex align-items-center gap-2" href="/login" style={{ color: textoColor }}>
                            <i className="bi bi-person fs-4"></i>
                            <div className="d-none d-sm-block">
                                <p className="m-0 small opacity-75 lh-1">Hola,</p>
                                <p className="m-0 fw-bold small">Inicia sesión</p>
                            </div>
                        </a>
                    )}
                    
                    <a className="position-relative ms-2" href="/cart" style={{ color: textoColor }}>
                        <i className="bi bi-cart3 fs-3"></i>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger" style={{ fontSize: "0.6rem" }}>0</span>
                    </a>
                </div>
            </div>

            {/* Mega Menú: Se mantiene BLANCO para legibilidad */}
            {showMegaMenu && (
                <div className="position-absolute w-100 shadow-lg border-top" style={{ top: "100%", left: 0, backgroundColor: "#ffffff", zIndex: 1000 }}>
                    <div className="container-fluid px-5 py-4">
                        <div className="row">
                            <div className="col-md-3 border-end">
                                <div className="list-group list-group-flush">
                                    {Object.keys(categoriasData).map((cat) => (
                                        <button 
                                            key={cat}
                                            onMouseEnter={() => setActiveCat(cat)}
                                            className={`list-group-item list-group-item-action border-0 d-flex justify-content-between align-items-center py-3 ${activeCat === cat ? 'bg-success bg-opacity-10 fw-bold text-success' : 'bg-white'}`}
                                        >
                                            {cat} <i className="bi bi-chevron-right small"></i>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="col-md-9 ps-5 text-dark">
                                <h4 className="fw-bold mb-4">{activeCat}</h4>
                                <div className="row">
                                    {categoriasData[activeCat].map((seccion, idx) => (
                                        <div className="col-md-4 mb-4" key={idx}>
                                            <h6 className="fw-bold text-success border-bottom pb-2 mb-3">{seccion.titulo}</h6>
                                            <ul className="list-unstyled">
                                                {seccion.items.map((item, i) => (
                                                    <li key={i} className="py-1"><a href="#" className="text-muted text-decoration-none small">{item}</a></li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;