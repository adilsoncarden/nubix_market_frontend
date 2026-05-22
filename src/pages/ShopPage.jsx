import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PRODUCTS, CATEGORIES } from "../data/products";
import { useCart } from "../store/CartContext";

const SORT_OPTIONS = [
  { value: "default",    label: "Relevancia"      },
  { value: "price-asc",  label: "Menor precio"    },
  { value: "price-desc", label: "Mayor precio"    },
  { value: "name-asc",   label: "Nombre A-Z"      },
];

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const { addToCart, items } = useCart();

  const [search, setSearch]   = useState("");
  const [sort,   setSort]     = useState("default");
  const [added,  setAdded]    = useState(null); // id del último producto añadido

  const activeCat = params.get("category") || "Todos";
  const activeTag = params.get("tag")      || "";

  const setCat = (cat) => {
    const p = new URLSearchParams();
    if (cat !== "Todos") p.set("category", cat);
    setParams(p);
  };

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (activeCat !== "Todos") list = list.filter((p) => p.category === activeCat);
    if (activeTag)             list = list.filter((p) => p.tag === activeTag);
    if (search.trim())         list = list.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    switch (sort) {
      case "price-asc":  return [...list].sort((a, b) => a.price - b.price);
      case "price-desc": return [...list].sort((a, b) => b.price - a.price);
      case "name-asc":   return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:           return list;
    }
  }, [activeCat, activeTag, search, sort]);

  const handleAdd = (product) => {
    addToCart(product);
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1200);
  };

  const inCart = (id) => items.find((i) => i.id === id)?.qty || 0;

  return (
    <div className="shop-page">
      {/* ── SIDEBAR + CONTENT ─────────────────────────────── */}
      <div className="container shop-layout">

        {/* Sidebar filtros */}
        <aside className="shop-sidebar">
          <p className="sidebar-title">Categorias</p>
          <ul className="sidebar-cats">
            {["Todos", ...CATEGORIES].map((cat) => (
              <li key={cat}>
                <button
                  className={`sidebar-cat-btn${activeCat === cat ? " active" : ""}`}
                  onClick={() => setCat(cat)}
                >
                  {cat}
                  <span className="cat-count">
                    {cat === "Todos"
                      ? PRODUCTS.length
                      : PRODUCTS.filter((p) => p.category === cat).length}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Contenido principal */}
        <main className="shop-main">

          {/* Barra superior */}
          <div className="shop-topbar">
            <div className="shop-search-wrap">
              <i className="bi bi-search shop-search-icon"></i>
              <input
                className="shop-search-input"
                placeholder="Buscar en tienda..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="shop-search-clear" onClick={() => setSearch("")}>
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
            <select
              className="shop-sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Pills de categorías (mobile/tablet) */}
          <div className="shop-cat-pills d-lg-none">
            {["Todos", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                className={`cat-pill${activeCat === cat ? " active" : ""}`}
                onClick={() => setCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Header resultado */}
          <div className="shop-results-header">
            <span className="results-count">{filtered.length} productos</span>
            {activeCat !== "Todos" && (
              <span className="results-cat">— {activeCat}</span>
            )}
          </div>

          {/* Grid de productos */}
          {filtered.length === 0 ? (
            <div className="shop-empty">
              <i className="bi bi-search fs-1 text-muted"></i>
              <p>No se encontraron productos.</p>
            </div>
          ) : (
            <div className="shop-grid">
              {filtered.map((product) => (
                <div key={product.id} className="product-card rounded-3 overflow-hidden position-relative">
                  {product.tag && (
                    <span className={`product-tag ${product.tagColor}`}>{product.tag}</span>
                  )}
                  {inCart(product.id) > 0 && (
                    <span className="in-cart-badge">
                      <i className="bi bi-cart-check"></i> {inCart(product.id)}
                    </span>
                  )}
                  <div className="product-img-wrap">
                    <img src={product.img} alt={product.name} loading="lazy" />
                  </div>
                  <div className="p-3">
                    <p className="product-cat mb-1">{product.category}</p>
                    <p className="product-name mb-2">{product.name}</p>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className="product-price">S/ {product.price.toFixed(2)}</span>
                        <span className="product-unit ms-1">/ {product.unit}</span>
                      </div>
                      <button
                        className={`btn-add-cart${added === product.id ? " added" : ""}`}
                        onClick={() => handleAdd(product)}
                        title="Agregar al carrito"
                      >
                        <i className={`bi ${added === product.id ? "bi-check-lg" : "bi-plus-lg"}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}