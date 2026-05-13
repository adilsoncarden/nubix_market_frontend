import React from "react"; 
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
import { Link } from "react-router-dom";
import { useCart } from "../store/CartContext";
import slide1 from "../assets/imagen1.png";
import slide2 from "../assets/imagen2.png";
import slide3 from "../assets/imagen3.png";
import slide4 from "../assets/imagen4.png";
import slide5 from "../assets/imagen5.png";
import slide6 from "../assets/imagen6.png";

// --- Configuración Centralizada Actualizada con Imágenes ---
export const CATEGORIAS_DATA = [
  { nombre: "Gaseosas",  img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&q=80", color: "#e3f2fd", text: "#1565c0" },
  { nombre: "Frutas",    img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&q=80", color: "#f1f8e9", text: "#2e7d32" },
  { nombre: "Lácteos",   img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80", color: "#fff3e0", text: "#e65100" },
  { nombre: "Snacks",    img: "https://images.unsplash.com/photo-1599490659223-930b44c027f9?w=200&q=80", color: "#fce4ec", text: "#c62828" },
  { nombre: "Abarrotes", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80", color: "#f3e5f5", text: "#6a1b9a" },
  { nombre: "Bebidas",   img: "https://images.unsplash.com/photo-1544145945-f904253d0c7b?w=200&q=80", color: "#e0f2f1", text: "#00695c" },
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
  {
    id: 1, nombre: "Manzanas 1kg", cat: "Frutas", precio: 5.90, tag: "Fresco", tagColor: "tag-green",
    img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80",
    descripcion: "Manzanas rojas crujientes y dulces, seleccionadas a mano.",
    detalles: "Origen: Huaral. Calidad: Exportación."
  },
  {
    id: 2, nombre: "Coca Cola 3L", cat: "Gaseosas", precio: 11.50, tag: "Popular", tagColor: "tag-blue",
    img: "https://images.unsplash.com/photo-1554866624-95def341-bab2?w=400&q=80",
    descripcion: "Bebida gaseosa refrescante sabor original para compartir.",
    detalles: "Contenido: 3 Litros. Envase: PET."
  },
  {
    id: 3, nombre: "Leche Gloria 1L", cat: "Lácteos", precio: 5.20, tag: "Básico", tagColor: "tag-yellow",
    img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
    descripcion: "Leche evaporada enriquecida con vitaminas A y D.",
    detalles: "Marca: Gloria. Presentación: Caja 1L."
  },
  {
    id: 4, nombre: "Aceite Primor 900ml", cat: "Abarrotes", precio: 9.00, tag: "Oferta", tagColor: "tag-red",
    img: "https://images.unsplash.com/photo-1474979220686-9a1d73e2fe6f?w=400&q=80",
    descripcion: "Aceite vegetal premium ideal para todo tipo de comidas.",
    detalles: "Marca: Primor. Contenido: 900ml."
  },
];

const BENEFICIOS = [
  { icono: "bi-truck",         titulo: "Envio Rapido",      sub: "Directo a tu casa" },
  { icono: "bi-shield-check", titulo: "Pago Seguro",       sub: "Transacciones protegidas" },
  { icono: "bi-star",          titulo: "Calidad Nubix",     sub: "Productos seleccionados" },
  { icono: "bi-chat-dots",    titulo: "Soporte Inmediato", sub: "Atencion personalizada" },
];

const ProductCard = ({ p }) => {
  const { addToCart } = useCart();

  return (
    <div className="col">
      <div className="product-card card border-0 h-100 rounded-4 overflow-hidden position-relative shadow-sm">
        {p.tag && <span className={`product-tag ${p.tagColor}`}>{p.tag}</span>}
        
        <div className="product-img-wrap">
          <img src={p.img} alt={p.nombre} />
        </div>

        <div className="card-body p-3 d-flex flex-column">
          <p className="product-cat mb-1">{p.cat}</p>
          <h6 className="product-name mb-2">{p.nombre}</h6>

          <div className="mb-3">
            <p className="mb-1 text-secondary" style={{ fontSize: '0.8rem', lineHeight: '1.2' }}>
              {p.descripcion}
            </p>
            <p className="mb-0 text-muted italic" style={{ fontSize: '0.7rem', fontStyle: 'italic' }}>
              {p.detalles}
            </p>
          </div>

          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className="product-price">S/ {p.precio.toFixed(2)}</span>
            <button
              className="btn-add-cart"
              aria-label="Agregar al carrito"
              onClick={() => addToCart({ id: p.id, name: p.nombre, category: p.cat, price: p.precio, img: p.img })}
            >
              <i className="bi bi-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Modificado para usar imágenes en lugar de iconos ---
const CategoryCard = ({ item }) => (
  <div className="col-4 col-md-2">
    <Link
      to={`/shop?category=${item.nombre}`}
      className="category-card text-decoration-none d-block text-center p-3 rounded-4 bg-white shadow-sm"
    >
      <div className="cat-icon-wrap mx-auto mb-2" style={{ background: item.color, overflow: 'hidden' }}>
        <img 
          src={item.img} 
          alt={item.nombre} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
        />
      </div>
      <span className="cat-label" style={{ color: item.text, fontWeight: '600' }}>{item.nombre}</span>
    </Link>
  </div>
);

const MainContent = () => (
  <div>
    <section id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
      <div className="carousel-indicators">
        {SLIDES_FIXED.map((_, i) => (
          <button key={i} type="button" data-bs-target="#heroCarousel" data-bs-slide-to={i} className={i === 0 ? "active" : ""} />
        ))}
      </div>
      <div className="carousel-inner hero-inner">
        {SLIDES_FIXED.map((s, i) => (
          <div key={i} className={`carousel-item h-100${i === 0 ? " active" : ""}`} data-bs-interval="5000">
            <Link to={s.to}>
              <img src={s.img} className="hero-img d-block w-100 h-100" alt={`Slide ${i + 1}`} />
            </Link>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" />
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" />
      </button>
    </section>

    <div className="benefits-bar">
      <div className="container">
        <div className="row g-3 text-center">
          {BENEFICIOS.map((b) => (
            <div key={b.titulo} className="col-6 col-md-3 benefit-item">
              <i className={`bi ${b.icono} benefit-icon`}></i>
              <p className="benefit-title">{b.titulo}</p>
              <p className="benefit-sub">{b.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <section className="container section-gap">
      <h3 className="section-title">Categorias Populares</h3>
      <div className="row g-3">
        {CATEGORIAS_DATA.map((item) => <CategoryCard key={item.nombre} item={item} />)}
      </div>
    </section>

    <section className="container section-gap pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="section-title mb-0">Top Seleccionados</h3>
        <Link to="/shop" className="see-all-link">
          Ver todos <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
      <div className="row row-cols-2 row-cols-md-4 g-4">
        {PRODUCTOS.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  </div>
);

export default MainContent;