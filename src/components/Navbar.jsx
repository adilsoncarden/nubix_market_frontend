import { useState, useEffect, useRef } from "react";
import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { useCart } from "../store/CartContext";
import logoImage from "../assets/logo.png";
import { CATEGORIAS_DATA } from "./MainContent";


export default function Navbar() {
=======
const Navbar = () => {
    // --- CONFIGURACIÓN DE COLOR RÁPIDA ---
    // Verde llamativo: #2ecc71 (Esmeralda), #27ae60 (Verde fuerte), #16a085 (Turquesa oscuro)
    const colorFondo = "#27ae60"; 
    const textoColor = "#ffffff"; // Color de letras del navbar (blanco para que resalte)
    // -------------------------------------
    const navigate = useNavigate();
    const { totalItems } = useCart();
    const dropdownRef = useRef(null);
    const userMenuRef = useRef(null); // Ref para el menú de usuario

    const [username, setUsername] = useState(
        () => localStorage.getItem("username") || "",
    );
    const [scrolled, setScrolled] = useState(false);
    const [catOpen, setCatOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false); // Estado para el menú de Pedro
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);

        // Cerrar menús si se hace clic fuera
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setUserMenuOpen(false);
            }

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setCatOpen(false);
            }
        };

        // Escuchar cambios de login/logout
        const handleStorageChange = () => {
            setUsername(localStorage.getItem("username") || "");
        };
        window.addEventListener("localStorageChanged", handleStorageChange);

        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);

=======
    
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
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener(
                "localStorageChanged",
                handleStorageChange,
            );
        };
    }, []);


    const handleSearch = (e) => {

    useEffect(() => {
        setUsername(localStorage.getItem("username") || "");
        setShowMegaMenu(false);
    }, [location]);

    const handleLogout = (e) => {

        e.preventDefault();

        if (searchValue.trim()) {
            navigate(`/shop?search=${searchValue.trim()}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setUsername("");
        setUserMenuOpen(false);

        navigate("/");
        window.location.reload();
    };

    const getMejorIcono = (nombre, iconoOriginal) => {
        if (iconoOriginal && iconoOriginal.startsWith("bi-")) {
            return iconoOriginal;
        }

        const n = nombre.toLowerCase();

        if (n.includes("gaseosa") || n.includes("bebida"))
            return "bi-cup-straw";
        if (n.includes("fruta") || n.includes("verdura")) return "bi-apple";
        if (n.includes("lácteo") || n.includes("leche")) return "bi-droplet";
        if (n.includes("snack") || n.includes("piqueo")) return "bi-egg-fried";
        if (n.includes("abarrote")) return "bi-box-seam";
        if (n.includes("limpieza")) return "bi-stars";
        if (n.includes("cuidado")) return "bi-heart-pulse";

        return "bi-tag";
    };

    const navItemStyle = {
        fontSize: "0.75rem",
        fontWeight: "700",
        letterSpacing: "0.5px",
        color: "#1a1a1a",
        textDecoration: "none",
    };

    return (
        <>
            <nav
                className={`fixed-top w-100 bg-white ${
                    scrolled ? "shadow-sm" : "border-bottom"
                }`}
                style={{ transition: "0.3s ease", zIndex: 1100 }}
            >
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between py-3">
                        {/* 1. LOGO */}
                        <div className="me-4">
                            <Link to="/">
                                <img
                                    src={logoImage}
                                    alt="Logo"
                                    style={{ height: "38px", width: "auto" }}
                                />
                            </Link>
                        </div>

                        {/* 2. CATEGORÍAS */}
                        <div
                            className="d-none d-lg-flex align-items-center gap-4"
                            ref={dropdownRef}
                        >
                            <div className="position-relative">
                                <span
                                    className="d-flex align-items-center gap-1 cursor-pointer"
                                    style={{
                                        ...navItemStyle,
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setCatOpen(!catOpen)}
                                >
                                    CATEGORÍAS{" "}
                                    <i
                                        className={`bi bi-chevron-${
                                            catOpen ? "up" : "down"
                                        }`}
                                        style={{ fontSize: "0.6rem" }}
                                    ></i>
                                </span>

                                {catOpen && (
                                    <div
                                        className="position-absolute top-100 start-0 bg-white shadow-lg rounded-3 py-2 mt-3 border-0"
                                        style={{
                                            zIndex: 1200,
                                            minWidth: "220px",
                                        }}
                                    >
                                        {CATEGORIAS_DATA.map((cat, idx) => (
                                            <Link
                                                key={idx}
                                                to={`/shop?category=${cat.nombre}`}
                                                className="dropdown-item py-2 px-3 d-flex align-items-center rounded-2 mx-2"
                                                style={{
                                                    width: "auto",
                                                    fontSize: "0.85rem",
                                                }}
                                                onClick={() =>
                                                    setCatOpen(false)
                                                }
                                            >
                                                <i
                                                    className={`bi ${getMejorIcono(
                                                        cat.nombre,
                                                        cat.icono,
                                                    )} me-3`}
                                                    style={{
                                                        fontSize: "1.2rem",
                                                        color: "#198754",
                                                        minWidth: "25px",
                                                    }}
                                                ></i>

                                                <span
                                                    style={{
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    {cat.nombre}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. BUSCADOR */}
                        <div
                            className="flex-grow-1 mx-4 d-none d-md-block"
                            style={{ maxWidth: "380px" }}
                        >
                            <form
                                className="position-relative"
                                onSubmit={handleSearch}
                            >
                                <i
                                    className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                                    style={{ fontSize: "0.8rem" }}
                                ></i>

                                <input
                                    type="text"
                                    className="form-control border-0 rounded-pill ps-5"
                                    placeholder="¿Qué estás buscando hoy?"
                                    style={{
                                        backgroundColor: "#f1f3f5",
                                        fontSize: "0.85rem",
                                        height: "40px",
                                    }}
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                />
                            </form>
                        </div>

                        {/* 4. ACCIONES */}
                        <div className="d-flex align-items-center gap-4">
                            {username ? (
                                <div
                                    className="position-relative"
                                    ref={userMenuRef}
                                >
                                    <button
                                        className="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center gap-2 border-0"
                                        onClick={() =>
                                            setUserMenuOpen(!userMenuOpen)
                                        }
                                    >
                                        <i className="bi bi-person fs-4"></i>

                                        {/* USERNAME VISIBLE */}
                                        <div
                                            className="d-flex flex-column text-start"
                                            style={{
                                                lineHeight: "1.1",
                                                minWidth: "90px",
                                            }}
                                        >
                                            <span
                                                className="text-muted"
                                                style={{
                                                    fontSize: "0.65rem",
                                                }}
                                            >
                                                HOLA,
                                            </span>

                                            <span
                                                className="fw-bold d-flex align-items-center gap-1"
                                                style={{
                                                    fontSize: "0.78rem",
                                                    color: "#1a1a1a",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {username}

                                                <i
                                                    className={`bi bi-chevron-${
                                                        userMenuOpen
                                                            ? "up"
                                                            : "down"
                                                    }`}
                                                    style={{
                                                        fontSize: "0.6rem",
                                                    }}
                                                ></i>
                                            </span>
                                        </div>
                                    </button>

                                    {/* Menú desplegable */}
                                    {userMenuOpen && (
                                        <div
                                            className="position-absolute end-0 bg-white shadow-lg border-0 mt-3 p-2 rounded-3"
                                            style={{
                                                zIndex: 1200,
                                                minWidth: "180px",
                                                top: "100%",
                                            }}
                                        >
                                            {localStorage.getItem("role") ===
                                                "ADMIN" && (
                                                <Link
                                                    className="dropdown-item rounded-2 py-2 fw-bold text-primary"
                                                    to="/admin/dashboard"
                                                    onClick={() =>
                                                        setUserMenuOpen(false)
                                                    }
                                                >
                                                    Panel Admin
                                                </Link>
                                            )}

                                            <button
                                                className="dropdown-item rounded-2 py-2 text-danger"
                                                onClick={handleLogout}
                                            >
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="text-dark text-decoration-none d-flex align-items-center gap-2"
                                >
                                    <i className="bi bi-person fs-4"></i>

                                    <div
                                        className="text-start d-none d-xl-block"
                                        style={{ lineHeight: "1.1" }}
                                    >
                                        <div
                                            className="text-muted"
                                            style={{ fontSize: "0.65rem" }}
                                        >
                                            {/* HOLA, */}
                                        </div>

                                        <div
                                            className="fw-bold"
                                            style={{ fontSize: "0.75rem" }}
                                        >
                                            INICIAR SESIÓN
                                        </div>
                                    </div>
                                </Link>
                            )}

                            <Link
                                to="/cart"
                                className="text-dark text-decoration-none d-flex align-items-center gap-2 position-relative"
                            >
                                <i className="bi bi-cart3 fs-4"></i>

                                {totalItems > 0 && (
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-success"
                                        style={{
                                            fontSize: "0.6rem",
                                            padding: "0.35em 0.5em",
                                            marginTop: "2px",
                                        }}
                                    >
                                        {totalItems}
                                    </span>
                                )}

                                <span
                                    className="d-none d-xl-inline fw-bold"
                                    style={{ fontSize: "0.75rem" }}
                                >
                                    CARRITO
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div style={{ marginTop: scrolled ? "75px" : "82px" }}></div>
        </>
    );
}
=======
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
