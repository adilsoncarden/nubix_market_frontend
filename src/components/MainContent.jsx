
import React, { useEffect, useState } from "react"; 
import { Carousel } from "bootstrap"; 
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
import { Link, useNavigate } from "react-router-dom"; 
import { useCart } from "../store/CartContext";

// Assets originales intactos
import slide1 from "../assets/imagen1.png";
import slide2 from "../assets/imagen2.png";
import slide3 from "../assets/imagen3.png";
import slide4 from "../assets/imagen4.png";
import slide5 from "../assets/imagen5.png";
import slide6 from "../assets/imagen6.png"; 

const PROMOCIONES_TOP = [
  { titulo: "¡OFERTAS DE INFARTO!", sub: "Llevate 3 y paga 2 en abarrotes", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80" },
  { titulo: "DELIVERY GRATIS", sub: "Por compras mayores a S/ 100", img: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1600&q=80" },
  { titulo: "NUBIX MARKET", sub: "Calidad y frescura garantizada", img: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1600&q=80" },
  { titulo: "CUIDADO PERSONAL", sub: "20% DSCTO en desodorantes", img: "https://images.unsplash.com/photo-1556229167-73191139ac06?w=1600&q=80" },
  { titulo: "ZONA LIMPIEZA", sub: "Todo para tu hogar aquí", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600&q=80" },
  { titulo: "MUNDO MASCOTAS", sub: "Croquetas con 15% de descuento", img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1500&q=80" }
];

export const CATEGORIAS_DATA = [
  { nombre: "Gaseosas",   img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&q=80", color: "#e3f2fd", text: "#1565c0" },
  { nombre: "Frutas",    img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&q=80", color: "#f1f8e9", text: "#2e7d32" },
  { nombre: "Lácteos",   img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80", color: "#fff3e0", text: "#e65100" },
  { nombre: "Snacks",    img: "https://tse2.mm.bing.net/th/id/OIP.mkWFpeW-AOHmEu6kqN1IpAHaJz?pid=Api&P=0&h=180", color: "#fce4ec", text: "#c62828" },
  { nombre: "Abarrotes", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80", color: "#f3e5f5", text: "#6a1b9a" },
  { nombre: "Bebidas",   img: "https://tse1.mm.bing.net/th/id/OIP.hF6gCMuONIZoD4N0TpqxuwHaHa?pid=Api&P=0&h=180", color: "#e0f2f1", text: "#00695c" },
];

const SLIDES_FIXED = [
  { img: slide1, to: "/shop" },
  { img: slide2, to: "/shop?category=Frutas" },
  { img: slide3, to: "/shop?category=Abarrotes" },
  { img: slide4, to: "/shop?category=Bebidas" },
  { img: slide5, to: "/shop?category=Snacks" },
  { img: slide6, to: "/shop?category=Lácteos" },
];

const PRODUCTOS = [
  { id: 1, nombre: "Manzanas 1kg", cat: "Frutas", precio: 5.9, tag: "Fresco", tagColor: "tag-green", img: "https://media.tottus.com.pe/tottusPE/10161826_1/width=480,height=480,quality=70,format=webp,fit=pad" },
  { id: 2, nombre: "Coca Cola 3L", cat: "Gaseosas", precio: 11.5, tag: "Popular", tagColor: "tag-blue", img: "https://media.tottus.com.pe/tottusPE/10164192_1/width=480,height=480,quality=70,format=webp,fit=pad" },
  { id: 3, nombre: "Leche Gloria 1L", cat: "Lácteos", precio: 5.2, tag: "Básico", tagColor: "tag-yellow", img: "https://tse3.mm.bing.net/th/id/OIP.678KDktTo1zSZ8U1nvhGdAHaHa?pid=Api&P=0&h=180" },
  { id: 4, nombre: "Aceite Primor 900ml", cat: "Abarrotes", precio: 9.0, tag: "Oferta", tagColor: "tag-red", img: "https://media.tottus.com.pe/tottusPE/42757360_2/width=480,height=480,quality=70,format=webp,fit=pad" },
  { id: 5, nombre: "Papas Nativas 1kg", cat: "Frutas", precio: 4.5, tag: "Orgánico", tagColor: "tag-green", img: "https://media.tottus.com.pe/tottusPE/20014196_1/width=480,height=480,quality=70,format=webp,fit=pad" },
  { id: 6, nombre: "Detergente Ariel 2kg", cat: "Abarrotes", precio: 18.9, tag: "Limpieza", tagColor: "tag-blue", img: "https://tse1.mm.bing.net/th/id/OIP.wbp2VG1zCwldW2Fe2XY98wHaHa?pid=Api&P=0&h=180" },
  { id: 7, nombre: "Yogurt Griego 1kg", cat: "Lácteos", precio: 12.5, tag: "Saludable", tagColor: "tag-yellow", img: "https://media.falabella.com/tottusPE/42736718_1/w=1200,h=1200,fit=pad" },
  { id: 8, nombre: "Papas Lays Clásicas", cat: "Snacks", precio: 6.8, tag: "Crunchy", tagColor: "tag-red", img: "https://media.tottus.com.pe/tottusPE/43526445_2/width=480,height=480,quality=70,format=webp,fit=pad" },
];

const BENEFICIOS = [
  { icono: "bi-truck", titulo: "Envio Rapido", sub: "Directo a tu casa" },
  { icono: "bi-shield-check", titulo: "Pago Seguro", sub: "Transacciones protegidas" },
  { icono: "bi-star", titulo: "Calidad Nubix", sub: "Productos seleccionados" },
  { icono: "bi-chat-dots", titulo: "Soporte Inmediato", sub: "Atencion personalizada" },
];

const DISTRITOS_LIMA = ["Ancón", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos", "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesús María", "La Molina", "La Victoria", "Lima", "Lince", "Los Olivos", "Lurigancho-Chosica", "Lurín", "Magdalena del Mar", "Miraflores", "Pachacámac", "Pucusana", "Pueblo Libre", "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo", "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores", "San Luis", "San Martín de Porres", "San Miguel", "Santa Anita", "Santa María del Mar", "Santa Rosa", "Santiago de Surco", "Surquillo", "Villa El Salvador", "Villa María del Triunfo"];
const DISTRITOS_CALLAO = ["Bellavista", "Callao", "Carmen de la Legua-Reynoso", "La Perla", "La Punta", "Mi Perú", "Ventanilla"];

const ProductCard = ({ p }) => {
  const { addToCart } = useCart();
  return (
    <div className="col">
      <Link to={`/producto/${p.id}`} className="text-decoration-none">
        <div className="product-card card border-0 h-100 rounded-4 overflow-hidden shadow-sm" style={{ cursor: 'pointer' }}>
          {p.tag && <span className={`product-tag ${p.tagColor}`}>{p.tag}</span>}
          <div className="product-img-wrap"><img src={p.img} alt={p.nombre} loading="lazy" /></div>
          <div className="card-body p-3 d-flex flex-column">
            <p className="product-cat mb-1">{p.cat}</p>
            <h6 className="product-name mb-2">{p.nombre}</h6>
            <div className="mt-auto d-flex justify-content-between align-items-center">
              <span className="product-price">S/ {p.precio.toFixed(2)}</span>
              <button className="btn-add-cart" onClick={(e) => { e.preventDefault(); addToCart({ ...p, name: p.nombre, price: p.precio }); }}><i className="bi bi-cart-plus"></i></button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const CategoryCard = ({ item }) => (
  <div className="col-4 col-md-2">
    <Link to={`/shop?category=${item.nombre}`} className="category-card text-decoration-none d-block text-center p-3 rounded-4 bg-white shadow-sm">
      <div className="cat-icon-wrap mx-auto mb-2" style={{ background: item.color, overflow: 'hidden' }}>
        <img src={item.img} alt={item.nombre} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
      </div>
      <span className="cat-label" style={{ color: item.text, fontWeight: '600' }}>{item.nombre}</span>
    </Link>
  </div>
);

const MainContent = () => {
  useEffect(() => {
    const mainEl = document.querySelector('#heroCarousel');
    if (mainEl) {
      new Carousel(mainEl, { interval: 8000, pause: false, ride: 'carousel' });
    }
  }, []);

  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 45 * 60 + 12); // 02:45:12 en segundos

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const VERDE_NUBIX = "#28a745";
  const ANUNCIOS_PROMO = ["¡APROVECHA LAS GRANDES PROMOCIONES DE LA SEMANA EN TODA LA TIENDA!", 
    "DELIVERY TOTALMENTE GRATUITO POR COMPRAS SUPERIORES A S/ 100", 
    "OBTÉN 10% DE DESCUENTO DIRECTO EN TU PRIMER PEDIDO REGISTRÁNDOTE HOY", 
    "PAGA DE FORMA SEGURA CON CUALQUIER TARJETA O TU BILLETERA DIGITAL BIPAY", 
    "PARTICIPA AUTOMÁTICAMENTE EN NUESTROS SORTEOS MENSUALES POR COMPRAS DESDE S/ 50", 
    "ACUMULA PUNTOS NUBIX EN CADA COMPRA Y CANJÉALOS POR VALES DE DSCTO"];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [direccionForm, setDireccionForm] = useState({ departamento: "", provincia: "", distrito: "", calle: "", numero: "", adicional: "" });
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);

  useEffect(() => {
    const textoCompleto = ANUNCIOS_PROMO[currentTextIndex];
    if (displayedText.length < textoCompleto.length) {
      const timerEscritura = setInterval(() => { setDisplayedText(textoCompleto.slice(0, displayedText.length + 1)); }, 50); 
      return () => clearInterval(timerEscritura);
    } else {
      const timerEspera = setTimeout(() => {
        setIsExiting(true);
        const timerTransicionCompleta = setTimeout(() => { setDisplayedText(""); setIsExiting(false); setCurrentTextIndex((prevIndex) => (prevIndex + 1) % ANUNCIOS_PROMO.length); }, 400);
        return () => clearTimeout(timerTransicionCompleta);
      }, 2600); 
      return () => clearTimeout(timerEspera);
    }
  }, [displayedText, currentTextIndex]);

  const handleDepartamentoChange = (e) => {
    const selectedDepartamento = e.target.value;
    setDireccionForm({ ...direccionForm, departamento: selectedDepartamento, provincia: "", distrito: "" });
    if (selectedDepartamento === "Lima") setProvincias(["Lima"]); else if (selectedDepartamento === "Callao") setProvincias(["Callao"]); else setProvincias([]);
  };

  const handleProvinciaChange = (e) => {
    const selectedProvincia = e.target.value;
    setDireccionForm({ ...direccionForm, provincia: selectedProvincia, distrito: "" });
    if (selectedProvincia === "Lima") setDistritos(DISTRITOS_LIMA); else if (selectedProvincia === "Callao") setDistritos(DISTRITOS_CALLAO); else setDistritos([]);
  };

  const handleLocationSubmit = (e) => { e.preventDefault(); console.log("Ubicación guardada:", direccionForm); setLocationModalOpen(false); };

  return (
    <div>
      <style>{`
        .track-container { overflow: hidden; width: 100%; height: 50px; background: ${VERDE_NUBIX}; position: relative; }
        .track-content { display: flex; width: max-content; animation: scrollRight 40s linear infinite; }
        .track-item { flex: 0 0 auto; width: 100vw; }
        @keyframes scrollRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .promo-title-styled { font-family: 'Arial Black', sans-serif; font-size: 1.1rem; color: #fff; text-shadow: 2px 2px 0px rgba(0,0,0,0.3); font-style: italic; margin-bottom: 0; }
        .product-img-wrap { height: 180px; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: #fff; padding: 15px; }
        .product-img-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .collage-main-card { background: radial-gradient(circle at center, #ffffff 0%, #e3f2fd 100%) !important; border-radius: 40px; min-height: 400px; position: relative; }
        .collage-sub-card { border-radius: 40px; height: 450px; position: relative; overflow: hidden; padding: 35px; display: flex; flex-direction: column; justify-content: space-between; }
        .blob-frame { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 75%; height: 55%; object-fit: cover; border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; animation: morphing 10s infinite alternate ease-in-out; box-shadow: 0 20px 40px rgba(0,0,0,0.2); z-index: 5; }
        @keyframes morphing { 0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; } 50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; } 100% { border-radius: 64% 36% 70% 30% / 30% 59% 41% 70%; } }
        .bg-3d-green { background: radial-gradient(circle at top left, #1b4d3e 0%, #0d2b22 100%) !important; }
        .bg-3d-pink { background: radial-gradient(circle at top left, #fce4ec 0%, #f06292 100%) !important; }
        .bg-3d-yellow { background: radial-gradient(circle at top left, #fffde7 0%, #fdd835 100%) !important; }
        .text-3d-front { position: relative; z-index: 10; }
        .btn-go-black { width: 45px; height: 45px; background: #000; color: #fff; border-radius: 50%; border: none; z-index: 10; }
        .typewriter-carousel-container { background-image: url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80'); background-size: cover; background-position: center; padding: 8px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); height: 42px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
        .typewriter-overlay { position: absolute; inset: 0; background-color: rgba(13, 43, 34, 0.85); z-index: 1; }
        .typewriter-text { color: #ffffff; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.8px; font-family: system-ui, -apple-system, sans-serif; text-align: center; transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease; display: inline-block; will-change: transform, opacity; position: relative; z-index: 2; white-space: nowrap; }
        .typewriter-text.exit-flying { transform: translateX(100vw); opacity: 0; }
        @media (max-width: 576px) { .typewriter-text { font-size: 0.7rem; letter-spacing: 0.4px; } }
        .garantia-wrapper { position: relative; max-width: 480px; margin: 0 auto; }
        .garantia-box { background-color: #f0f0f0; width: 100%; }
        .garantia-icon-wrap { background-color: #006633; width: 54px; height: 54px; display: flex; align-items: center; justify-content: center; border-radius: 16px; flex-shrink: 0; }
        .garantia-icon-wrap i { color: #ffffff; font-size: 1.6rem; }
        .garantia-title { font-family: system-ui, -apple-system, sans-serif; font-weight: 700; color: #111111; font-size: 1.3rem; line-height: 1.2; }
        .garantia-desc { font-family: system-ui, -apple-system, sans-serif; color: #555555; font-size: 0.95rem; line-height: 1.4; margin-bottom: 0; }
        .garantia-chat-btn { position: absolute; right: -20px; bottom: -20px; background-color: #ffd600; border: none; width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s ease; z-index: 20; }
        .garantia-chat-btn:hover { transform: scale(1.05); }
        .garantia-chat-btn i { color: #222222; font-size: 1.5rem; transform: translateY(1px); }
        @media (max-width: 520px) { .garantia-wrapper { max-width: 90%; } .garantia-chat-btn { right: -10px; bottom: -10px; width: 48px; height: 48px; } }
        .wrapper-barra-ubicacion-top { background-color: #f4f4f4; width: 100%; border-bottom: 1px solid #e2e8f0; }
        .bar-ubicacion-trigger { display: inline-flex; align-items: center; gap: 6px; padding: 8px 0; background: transparent; cursor: pointer; transition: opacity 0.2s ease; }
        .bar-ubicacion-trigger:hover { opacity: 0.8; }
        .bar-ubicacion-trigger i.bi-geo-alt { color: #495057; font-size: 1rem; }
        .bar-ubicacion-text { font-weight: 500; color: #333333; font-size: 0.85rem; font-family: system-ui, -apple-system, sans-serif; }
        .modal-location-overlay { position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.45); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 15px; }
        .modal-location-card { background: #fff; width: 100%; max-width: 440px; border-radius: 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); overflow: hidden; position: relative; animation: modalAppear 0.25s ease-out; }
        @keyframes modalAppear { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .modal-location-header { padding: 24px 24px 12px 24px; display: flex; align-items: flex-start; gap: 12px; }
        .modal-location-header i.bi-geo-alt { font-size: 1.4rem; color: #495057; margin-top: 2px; }
        .modal-location-title { font-size: 1.25rem; font-weight: 700; color: #212529; line-height: 1.3; }
        .modal-location-close { background: transparent; border: none; font-size: 1.3rem; color: #adb5bd; cursor: pointer; padding: 0; line-height: 1; transition: color 0.2s; }
        .modal-location-close:hover { color: #495057; }
        .modal-location-body { padding: 0 24px 24px 24px; }
        .modal-location-subtitle { font-size: 0.88rem; color: #6c757d; line-height: 1.4; margin-bottom: 20px; }
        .form-label-custom { font-size: 0.85rem; font-weight: 600; color: #495057; margin-bottom: 4px; }
        .form-select-custom, .form-input-custom { width: 100%; padding: 10px 12px; font-size: 0.9rem; border: 1px solid #ced4da; border-radius: 8px; background-color: #fff; color: #495057; outline: none; transition: border-color 0.2s; }
        .form-select-custom:focus, .form-input-custom:focus { border-color: #86b7fe; box-shadow: 0 0 0 0.25rem rgba(13,110,253,.25); }
        .form-input-underline { width: 100%; border: none; border-bottom: 1px solid #ced4da; padding: 6px 0; font-size: 0.9rem; outline: none; color: #495057; transition: border-color 0.2s; }
        .form-input-underline:focus { border-bottom-color: #212529; }
        .form-input-underline::placeholder { color: #adb5bd; }
        .btn-modal-continuar { background-color: #f4f5f6; color: #6c757d; border: none; width: auto; min-width: 120px; padding: 10px 24px; font-size: 0.9rem; font-weight: 600; border-radius: 20px; cursor: pointer; transition: all 0.2s; }
        .btn-modal-continuar.active-ready { background-color: #000; color: #fff; }
        .btn-modal-continuar.active-ready:hover { background-color: #212529; }
      `}</style>

      <div className="wrapper-barra-ubicacion-top">
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-start">
            <div className="bar-ubicacion-trigger" onClick={() => setLocationModalOpen(true)}>
              <i className="bi bi-geo-alt"></i>
              <span className="bar-ubicacion-text">Ingresa tu ubicación</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-0">
        <div className="track-container">
          <div className="track-content">
            {[...PROMOCIONES_TOP, ...PROMOCIONES_TOP].map((promo, index) => (
              <div key={index} className="track-item">
                <div className="d-flex align-items-center position-relative overflow-hidden" style={{ height: "50px", backgroundColor: VERDE_NUBIX }}>
                  <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60%', backgroundImage: `url(${promo.img})`, backgroundSize: 'cover', backgroundPosition: 'center', clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)', zIndex: 1 }}>
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${VERDE_NUBIX} 10%, rgba(40,167,69,0.3) 100%)` }}></div>
                  </div>
                  <div className="container position-relative" style={{ zIndex: 2 }}>
                    <div className="row align-items-center flex-nowrap g-0">
                      <div className="col-auto"><h2 className="mb-0 fw-black text-white promo-title-styled">{promo.titulo}</h2></div>
                      <div className="col-auto mx-3" style={{ height: '20px', width: '2px', backgroundColor: 'rgba(255,255,255,0.5)' }}></div>
                      <div className="col-auto"><p className="mb-0 fw-bold text-white text-uppercase" style={{ fontSize: '0.85rem' }}>{promo.sub}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {locationModalOpen && (
        <div className="modal-location-overlay" onClick={() => setLocationModalOpen(false)}>
          <div className="modal-location-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-location-header justify-content-between">
              <div className="d-flex align-items-start gap-2">
                <i className="bi bi-geo-alt"></i>
                <h3 className="modal-location-title">¿Dónde quieres recibir tu compra?</h3>
              </div>
              <button className="modal-location-close" onClick={() => setLocationModalOpen(false)}><i className="bi bi-x-lg"></i></button>
            </div>
            <div className="modal-location-body">
              <p className="modal-location-subtitle">Ingresa tu dirección y te mostraremos los productos disponibles para envío</p>
              <form onSubmit={handleLocationSubmit}>
                <div className="mb-3">
                  <label className="form-label-custom">Departamento</label>
                  <select className="form-select-custom" value={direccionForm.departamento} onChange={handleDepartamentoChange}>
                    <option value="">Ingresa un departamento</option>
                    <option value="Lima">Lima</option>
                    <option value="Callao">Callao</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Provincia</label>
                  <select className="form-select-custom" value={direccionForm.provincia} disabled={provincias.length === 0} onChange={handleProvinciaChange}>
                    <option value="">Ingresa una provincia</option>
                    {provincias.map(provincia => (<option key={provincia} value={provincia}>{provincia}</option>))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Distrito</label>
                  <select className="form-select-custom" value={direccionForm.distrito} disabled={distritos.length === 0} onChange={(e) => setDireccionForm({...direccionForm, distrito: e.target.value})}>
                    <option value="">Ingresa un distrito</option>
                    {distritos.map(distrito => (<option key={distrito} value={distrito}>{distrito}</option>))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Calle</label>
                  <input type="text" className="form-input-underline" placeholder="2 de Mayo" value={direccionForm.calle} onChange={(e) => setDireccionForm({...direccionForm, calle: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Número</label>
                  <input type="text" className="form-input-underline" placeholder="123" value={direccionForm.numero} onChange={(e) => setDireccionForm({...direccionForm, numero: e.target.value})} />
                </div>
                <div className="mb-4">
                  <label className="form-label-custom">Dpto./Casa/Oficina/Condominio (opcional)</label>
                  <input type="text" className="form-input-underline" placeholder="Ej: Casa 10" value={direccionForm.adicional} onChange={(e) => setDireccionForm({...direccionForm, adicional: e.target.value})} />
                </div>
                <div className="text-end">
                  <button type="submit" className={`btn-modal-continuar ${direccionForm.distrito && direccionForm.calle ? "active-ready" : ""}`}>Continuar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <section id="heroCarousel" className="carousel slide carousel-fade mt-0">
        <div className="carousel-indicators">
          {SLIDES_FIXED.map((_, i) => (<button key={i} type="button" data-bs-target="#heroCarousel" data-bs-slide-to={i} className={i === 0 ? "active" : ""}></button>))}
        </div>
        <div className="carousel-inner hero-inner">
          {SLIDES_FIXED.map((s, i) => (<div key={i} className={`carousel-item h-100 ${i === 0 ? "active" : ""}`}><Link to={s.to}><img src={s.img} className="hero-img d-block w-100 h-100" alt="slide" loading="lazy" /></Link></div>))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev"><span className="carousel-control-prev-icon"></span></button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next"><span className="carousel-control-next-icon"></span></button>
      </section>

      <div className="benefits-bar py-4">
        <div className="container">
          <div className="row g-3 text-center">
            {BENEFICIOS.map((b) => (<div key={b.titulo} className="col-6 col-md-3"><i className={`bi ${b.icono} benefit-icon mb-2 d-block fs-2`}></i><p className="benefit-title mb-0 fw-bold">{b.titulo}</p><small className="benefit-sub text-muted">{b.sub}</small></div>))}
          </div>
        </div>
      </div>

      <div className="container-fluid px-0 mt-1 mb-3">
        <div className="typewriter-carousel-container">
          <div className="typewriter-overlay"></div>
          <div className={`typewriter-text ${isExiting ? "exit-flying" : ""}`}>{displayedText}</div>
        </div>
      </div>

      <section className="container my-4">
        <div className="d-flex align-items-center gap-3 p-3 bg-white border rounded-4 shadow-sm">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-danger px-3 py-2 text-uppercase fw-bold">Limited Time</span>
            <h4 className="mb-0 fw-bold">Flash Offers</h4>
          </div>
          <div className="d-flex align-items-center gap-2 text-danger fw-bold ms-md-4">
            <i className="bi bi-clock"></i>
            <span className="font-monospace">Ends in: {formatTime(timeLeft)}</span>
          </div>
        </div>
      </section>

      <section className="container section-categorias">
        <h3 className="section-title mb-4 fw-bold">Categorías Populares</h3>
        <div className="row g-3">
          {CATEGORIAS_DATA.map((item) => <CategoryCard key={item.nombre} item={item} />)}
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          <div className="col-12">
            <div className="collage-main-card d-flex align-items-center p-5 shadow-lg overflow-hidden">
              <div className="row w-100 align-items-center">
                <div className="col-md-6 text-center d-none d-md-block position-relative" style={{height: '300px'}}><img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" className="blob-frame" alt="Fresh" loading="lazy" /></div>
                <div className="col-md-6"><h1 className="fw-black display-4 mb-3" style={{color: '#0d2b22'}}>Frutas y Verduras.<br/>Entrega Diaria.</h1><p className="text-muted fs-5 mb-4">La mejor calidad seleccionada para tu hogar.</p><Link to="/shop" className="btn btn-dark rounded-pill px-5 py-3 fw-bold">Comprar Ahora</Link></div>
              </div>
            </div>
          </div>
          <div className="col-md-4"><div className="collage-sub-card bg-3d-green shadow-lg"><div className="text-3d-front text-white"><h4 className="fw-bold">10% DE AHORRO EN TU PRIMERA COMPRA</h4></div><img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" className="blob-frame" alt="promo1" loading="lazy" /><div className="text-3d-front d-flex justify-content-between align-items-center"><span className="text-white-50 small">Regístrate hoy para tu primer pedido.</span><button className="btn-go-black"><i className="bi bi-chevron-right"></i></button></div></div></div>
          <div className="col-md-4"><div className="collage-sub-card bg-3d-pink shadow-lg"><div className="text-3d-front" style={{color: '#880e4f'}}><h4 className="fw-bold">ENVÍO GRATIS POR COMPRAS MAYORES A 100 SOLES</h4></div><img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600" className="blob-frame" alt="promo2" loading="lazy" /><div className="text-3d-front d-flex justify-content-between align-items-center"><span className="small" style={{color: '#880e4f'}}>Abastece tu despensa sin costo extra.</span><button className="btn-go-black"><i className="bi bi-chevron-right"></i></button></div></div></div>
          <div className="col-md-4"><div className="collage-sub-card bg-3d-yellow shadow-lg"><div className="text-3d-front" style={{color: '#333'}}><h4 className="fw-bold">PRODUCTOS DE LA MEJOR CALIDAD</h4></div><img src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80" className="blob-frame" alt="Tienda Market" loading="lazy" /><div className="text-3d-front d-flex justify-content-between align-items-center"><span className="small" style={{color: '#333'}}>Lo mejor del mercado directo a tu mesa.</span><button className="btn-go-black text-white"><i className="bi bi-chevron-right"></i></button></div></div></div>
        </div>
      </section>

      <section className="container py-5">
        <h3 className="section-title mb-4 fw-bold">Top Seleccionados</h3>
        <div className="row row-cols-2 row-cols-md-4 g-4">{PRODUCTOS.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="container pb-5 pt-3">
        <div className="garantia-wrapper">
          <div className="garantia-box p-4 rounded-4 shadow-sm d-flex align-items-start gap-3">
            <div className="garantia-icon-wrap"><i className="bi bi-shield-check"></i></div>
            <div><h4 className="garantia-title mb-1">Garantía de mejor precio</h4><p className="garantia-desc">Si encuentras un precio más bajo, te devolvemos la diferencia. Compra con total seguridad.</p></div>
          </div>
          <button className="garantia-chat-btn" aria-label="Abrir chat"><i className="bi bi-chat-square-text"></i></button>
        </div>
      </section>
    </div>
  );
};

export default MainContent;