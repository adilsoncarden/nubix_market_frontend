
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../store/CartContext";

// Base de datos (mantenida igual)
const PRODUCTOS_DATA = [
  { id: 1, nombre: "Manzanas 1kg", cat: "Frutas", precio: 5.9, tag: "Fresco", tagColor: "tag-green", img: "https://media.tottus.com.pe/tottusPE/10161826_1/width=480,height=480,quality=70,format=webp,fit=pad", descripcion: "Manzanas frescas seleccionadas de los mejores valles del país. Ideales para ensaladas, postres o consumo directo diario.", marca: "Campo Fresco", SKU: "NUB-FRU-001",
    caracteristicas: [{ label: "Certificación", value: "100% Orgánico", icon: "bi-leaf" }, { label: "Origen", value: "Jaén, Cajamarca", icon: "bi-geo-alt" }, { label: "Tostado", value: "N/A", icon: "bi-cup-hot" }, { label: "Contenido", value: "1kg Neto", icon: "bi-bag" }],
    comparativa: [{ tienda: "Tottus", precio: 6.50 }, { tienda: "Wong", precio: 6.20 }, { tienda: "Nubix Market", precio: 5.90 }] },
  { id: 2, nombre: "Coca Cola 3L", cat: "Gaseosas", precio: 11.5, tag: "Popular", tagColor: "tag-blue", img: "https://media.tottus.com.pe/tottusPE/10164192_1/width=480,height=480,quality=70,format=webp,fit=pad", descripcion: "Bebida gasificada Coca Cola sabor original de 3 Litros. Perfecta para compartir en almuerzos familiares y reuniones.", marca: "The Coca-Cola Company", SKU: "NUB-BEB-002",
    caracteristicas: [{ label: "Formato", value: "Botella 3L", icon: "bi-cup-straw" }, { label: "Sabor", value: "Original", icon: "bi-droplet" }, { label: "Envase", value: "Plástico", icon: "bi-box" }, { label: "Tipo", value: "Gaseosa", icon: "bi-info-circle" }],
    comparativa: [{ tienda: "Tottus", precio: 12.50 }, { tienda: "Wong", precio: 12.00 }, { tienda: "Nubix Market", precio: 11.50 }] },
  { id: 3, nombre: "Leche Gloria 1L", cat: "Lácteos", precio: 5.2, tag: "Básico", tagColor: "tag-yellow", img: "https://tse3.mm.bing.net/th/id/OIP.678KDktTo1zSZ8U1nvhGdAHaHa?pid=Api&P=0&h=180", descripcion: "Leche evaporada entera Gloria en formato de cartón de 1 Litro con empaque práctico abre fácil. Enriquecida con Vitaminas A y D.", marca: "Gloria", SKU: "NUB-LAC-003",
    caracteristicas: [{ label: "Tipo", value: "Evaporada", icon: "bi-droplet" }, { label: "Contenido", value: "1 Litro", icon: "bi-cup" }, { label: "Vitaminas", value: "A y D", icon: "bi-shield-check" }, { label: "Estado", value: "Pasteurizado", icon: "bi-patch-check" }],
    comparativa: [{ tienda: "Tottus", precio: 5.80 }, { tienda: "Wong", precio: 5.50 }, { tienda: "Nubix Market", precio: 5.20 }] },
  { id: 4, nombre: "Aceite Primor 900ml", cat: "Abarrotes", precio: 9.0, tag: "Oferta", tagColor: "tag-red", img: "https://media.tottus.com.pe/tottusPE/42757360_2/width=480,height=480,quality=70,format=webp,fit=pad", descripcion: "Aceite vegetal premium Primor, ideal para todo tipo de cocciones y frituras en el hogar, manteniendo el sabor original de tus comidas.", marca: "Alicorp", SKU: "NUB-ABA-004",
    caracteristicas: [{ label: "Tipo", value: "Vegetal", icon: "bi-droplet" }, { label: "Contenido", value: "900ml", icon: "bi-cup" }, { label: "Uso", value: "Cocina", icon: "bi-fire" }, { label: "Origen", value: "Nacional", icon: "bi-geo-alt" }],
    comparativa: [{ tienda: "Tottus", precio: 9.90 }, { tienda: "Wong", precio: 9.50 }, { tienda: "Nubix Market", precio: 9.00 }] },
  { id: 5, nombre: "Papas Nativas 1kg", cat: "Frutas", precio: 4.5, tag: "Orgánico", tagColor: "tag-green", img: "https://media.tottus.com.pe/tottusPE/20014196_1/width=480,height=480,quality=70,format=webp,fit=pad", descripcion: "Papas nativas cosechadas artesanalmente por comunidades andinas. Textura harinosa perfecta para sancochar o freír.", marca: "Raíces Peruanas", SKU: "NUB-FRU-005",
    caracteristicas: [{ label: "Tipo", value: "Nativa", icon: "bi-flower1" }, { label: "Origen", value: "Andino", icon: "bi-geo-alt" }, { label: "Calidad", value: "Artesanal", icon: "bi-star" }, { label: "Peso", value: "1kg", icon: "bi-basket" }],
    comparativa: [{ tienda: "Tottus", precio: 5.50 }, { tienda: "Wong", precio: 5.00 }, { tienda: "Nubix Market", precio: 4.50 }] },
  { id: 6, nombre: "Detergente Ariel 2kg", cat: "Abarrotes", precio: 18.9, tag: "Limpieza", tagColor: "tag-blue", img: "https://tse1.mm.bing.net/th/id/OIP.wbp2VG1zCwldW2Fe2XY98wHaHa?pid=Api&P=0&h=180", descripcion: "Detergente en polvo Ariel Concentrado. Remoción de manchas difíciles a la primera lavada y cuidado avanzado de fibras textiles.", marca: "Procter & Gamble", SKU: "NUB-LIM-006",
    caracteristicas: [{ label: "Tipo", value: "En Polvo", icon: "bi-snow" }, { label: "Peso", value: "2kg", icon: "bi-bag" }, { label: "Efecto", value: "Concentrado", icon: "bi-lightning" }, { label: "Uso", value: "Ropa", icon: "bi-shirt" }],
    comparativa: [{ tienda: "Tottus", precio: 20.00 }, { tienda: "Wong", precio: 19.50 }, { tienda: "Nubix Market", precio: 18.90 }] },
  { id: 7, nombre: "Yogurt Griego 1kg", cat: "Lácteos", precio: 12.5, tag: "Saludable", tagColor: "tag-yellow", img: "https://media.falabella.com/tottusPE/42736718_1/w=1200,h=1200,fit=pad", descripcion: "Yogurt natural estilo griego de 1 Kilogramo. Alto en proteínas, consistencia cremosa y sin azúcares añadidos.", marca: "Tottus Selection", SKU: "NUB-LAC-007",
    caracteristicas: [{ label: "Tipo", value: "Griego", icon: "bi-cup-hot" }, { label: "Contenido", value: "1kg", icon: "bi-bag" }, { label: "Nutrición", value: "Proteico", icon: "bi-heart-pulse" }, { label: "Azúcar", value: "Sin azúcar", icon: "bi-x-circle" }],
    comparativa: [{ tienda: "Tottus", precio: 13.90 }, { tienda: "Wong", precio: 13.50 }, { tienda: "Nubix Market", precio: 12.50 }] },
  { id: 8, nombre: "Papas Lays Clásicas", cat: "Snacks", precio: 6.8, tag: "Crunchy", tagColor: "tag-red", img: "https://media.tottus.com.pe/tottusPE/43526445_2/width=480,height=480,quality=70,format=webp,fit=pad", descripcion: "Hojuelas de papas fritas Lay's clásicas con el toque perfecto de sal. Crujientes, deliciosas e ideales para calmar el antojo.", marca: "Pepsico", SKU: "NUB-SNA-008",
    caracteristicas: [{ label: "Tipo", value: "Snack", icon: "bi-emoji-smile" }, { label: "Sabor", value: "Clásico", icon: "bi-patch-check" }, { label: "Textura", value: "Crujiente", icon: "bi-soundwave" }, { label: "Peso", value: "Variado", icon: "bi-bag" }],
    comparativa: [{ tienda: "Tottus", precio: 7.50 }, { tienda: "Wong", precio: 7.20 }, { tienda: "Nubix Market", precio: 6.80 }] }
];

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const producto = PRODUCTOS_DATA.find((p) => p.id === parseInt(id));

  // Generar stock random al cargar el producto
  const stockRandom = React.useMemo(() => Math.floor(Math.random() * (99 - 10 + 1)) + 10, [id]);

  const [bgPos, setBgPos] = useState("50% 50%");
  const [isZooming, setIsZooming] = useState(false);
  const [activeTab, setActiveTab] = useState("detalle");
  const [cantidad, setCantidad] = useState(1);

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning rounded-4 p-4 shadow-sm">
          <h4 className="fw-bold">Producto no encontrado</h4>
          <Link to="/" className="btn btn-dark rounded-pill px-4 mt-2">Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBgPos(`${x}% ${y}%`);
  };

  const handleAgregarAlCarrito = () => {
    for (let i = 0; i < cantidad; i++) {
      addToCart({
        id: producto.id,
        nombre: producto.nombre,
        name: producto.nombre, 
        precio: producto.precio,
        price: producto.precio, 
        img: producto.img
      });
    }
  };

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-dark">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/shop" className="text-decoration-none text-dark">{producto.cat}</Link></li>
          <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>

      <div className="row g-5">
        <div className="col-md-6">
          <div 
            className="zoom-container rounded-4 shadow-sm border border-light"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => { setIsZooming(false); setBgPos("50% 50%"); }}
            style={{ 
              backgroundImage: isZooming ? `url(${producto.img})` : "none",
              backgroundPosition: bgPos,
              backgroundSize: "220%"
            }}
          >
            <img src={producto.img} alt={producto.nombre} className="img-fluid w-100 h-100 p-4" style={{ objectFit: "contain", opacity: isZooming ? 0 : 1, transition: "opacity 0.15s ease" }} />
          </div>
        </div>

        <div className="col-md-6 d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-secondary rounded-pill px-3 py-1 text-uppercase" style={{ fontSize: '0.75rem' }}>{producto.cat}</span>
              {producto.tag && (
                <span className="badge bg-success rounded-pill px-3 py-1" style={{ fontSize: '0.75rem' }}>{producto.tag}</span>
              )}
            </div>
            <h1 className="fw-black text-dark mb-2 display-6">{producto.nombre}</h1>
            <p className="text-muted small mb-3">Marca: <strong className="text-dark">{producto.marca || "Genérico"}</strong> | SKU: {producto.SKU || "NUB-000"}</p>
            <hr className="my-3 text-muted opacity-25" />
            
            <div className="price-box my-3 p-3 bg-light rounded-4 d-inline-block w-100">
              <span className="text-muted fs-6 d-block">Precio Online:</span>
              <h2 className="text-success fw-black display-5 mb-0">S/ {producto.precio.toFixed(2)}</h2>
              {/* Sección de stock agregada en verde */}
              <div className="mt-2 text-success fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill text-success"></i> 
                Stock disponible: {stockRandom} unidades
              </div>
            </div>
            
            <p className="text-secondary mt-3">{producto.descripcion}</p>
          </div>

          <div className="mt-4 p-4 rounded-4 border border-light bg-white shadow-sm">
            <div className="row align-items-center g-3">
              <div className="col-auto">
                <span className="small d-block text-muted mb-1 fw-bold">Cantidad:</span>
                <div className="d-flex align-items-center border rounded-pill bg-light p-1">
                  <button className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none fw-bold fs-5" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
                  <span className="px-3 fw-bold fs-6" style={{ minWidth: "30px", textAlign: "center" }}>{cantidad}</span>
                  <button className="btn btn-sm btn-link text-dark p-0 px-2 text-decoration-none fw-bold fs-5" onClick={() => setCantidad(cantidad + 1)}>+</button>
                </div>
              </div>
              <div className="col">
                <button className="btn btn-success w-100 rounded-pill py-3 fw-bold shadow-sm text-uppercase" onClick={handleAgregarAlCarrito} style={{ backgroundColor: "#28a745", border: "none" }}>
                  <i className="bi bi-cart-plus-fill me-2"></i> Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5 pt-4">
        <div className="col-12">
          <ul className="nav nav-tabs border-bottom-2">
            <li className="nav-item">
              <button className={`nav-link fw-bold border-0 px-4 py-3 ${activeTab === "detalle" ? "active border-bottom border-dark text-dark" : "text-muted"}`} onClick={() => setActiveTab("detalle")} style={{ background: 'transparent' }}>Características y Comparativa</button>
            </li>
          </ul>

          <div className="tab-content p-4 bg-white border border-top-0 rounded-bottom-4 shadow-sm">
            <div className="row g-3 mb-4">
              {producto.caracteristicas.map((item, idx) => (
                <div className="col-6 col-md-3" key={idx}>
                  <div className="p-3 border rounded-4 text-center h-100">
                    <i className={`bi ${item.icon} fs-4 text-success`}></i>
                    <p className="text-muted small mb-0 mt-2">{item.label}</p>
                    <h6 className="fw-bold mb-0">{item.value}</h6>
                  </div>
                </div>
              ))}
            </div>
            
            <h6 className="fw-bold mb-3 mt-4">COMPARATIVA DE PRECIOS</h6>
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-3">
                {producto.comparativa.map((c, i) => (
                  <div key={i} className={`d-flex justify-content-between py-2 ${c.tienda === "Nubix Market" ? "text-success fw-bold bg-light px-2 rounded" : "border-bottom"}`}>
                    <span>{c.tienda}</span> <span className="fw-bold">S/ {c.precio.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .zoom-container { width: 100%; height: 450px; overflow: hidden; cursor: zoom-in; background-repeat: no-repeat; background-position: 50% 50%; background-color: #ffffff; display: flex; align-items: center; justify-content: center; }
        .fw-black { font-weight: 900 !important; }
        .nav-tabs .nav-link.active { border: none !important; border-bottom: 3px solid #111 !important; color: #000 !important; background: transparent !important; }
      `}</style>
    </div>
  );
};

export default ProductDetail;