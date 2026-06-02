import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useShopProducts } from "../features/products/hooks/useShopProducts";
import { useCart } from "../store/CartContext";
import { useFavorites } from "../store/FavoritesContext";
import { useAuth } from "../store/AuthContext";
import { setRedirectUrl } from "../utils/authUtils";

const SORT_OPTIONS = [
    { value: "default", label: "Relevancia" },
    { value: "price-asc", label: "Menor precio" },
    { value: "price-desc", label: "Mayor precio" },
    { value: "name-asc", label: "Nombre A-Z" },
];

const PAGE_SIZE = 12;

export default function ShopPage() {
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();
    const { addToCart, items } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { token } = useAuth();
    const { products, categories, loading, error } = useShopProducts();

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("default");
    const [added, setAdded] = useState(null);
    const [page, setPage] = useState(1);

    const activeCat = params.get("category") || "Todos";
    const activeTag = params.get("tag") || "";

    const setCat = (cat) => {
        setPage(1);
        const p = new URLSearchParams();
        if (cat !== "Todos") p.set("category", cat);
        setParams(p);
    };

    const filtered = useMemo(() => {
        let list = products;
        if (activeCat !== "Todos")
            list = list.filter((p) => p.category === activeCat);
        if (activeTag) list = list.filter((p) => p.tag === activeTag);
        if (search.trim())
            list = list.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase()),
            );
        switch (sort) {
            case "price-asc":
                return [...list].sort((a, b) => a.price - b.price);
            case "price-desc":
                return [...list].sort((a, b) => b.price - a.price);
            case "name-asc":
                return [...list].sort((a, b) => a.name.localeCompare(b.name));
            default:
                return list;
        }
    }, [products, activeCat, activeTag, search, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const rangeFrom =
        filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const rangeTo = Math.min(page * PAGE_SIZE, filtered.length);

    useEffect(() => {
        setPage(1);
    }, [search, sort, activeCat, activeTag]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const handleAdd = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setAdded(product.id);
        setTimeout(() => setAdded(null), 1200);
    };

    const handleToggleFavorite = (e, productoId) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
            setRedirectUrl("/shop");
            navigate("/login");
            return;
        }

        toggleFavorite(productoId);
    };

    const inCart = (id) => items.find((i) => i.id === id)?.qty || 0;

    return (
        <div className="shop-page">
            <div className="container shop-layout">
                <aside className="shop-sidebar">
                    <p className="sidebar-title">Categorias</p>
                    <ul className="sidebar-cats">
                        {["Todos", ...categories].map((cat) => (
                            <li key={cat}>
                                <button
                                    className={`sidebar-cat-btn${activeCat === cat ? " active" : ""}`}
                                    onClick={() => setCat(cat)}
                                >
                                    {cat}
                                    <span className="cat-count">
                                        {cat === "Todos"
                                            ? products.length
                                            : products.filter(
                                                  (p) => p.category === cat,
                                              ).length}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="shop-main">
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
                                <button
                                    className="shop-search-clear"
                                    onClick={() => setSearch("")}
                                >
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
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="shop-cat-pills d-lg-none">
                        {["Todos", ...categories].map((cat) => (
                            <button
                                key={cat}
                                className={`cat-pill${activeCat === cat ? " active" : ""}`}
                                onClick={() => setCat(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="shop-results-header">
                        <span className="results-count">
                            {loading
                                ? "Cargando..."
                                : filtered.length === 0
                                  ? "0 productos"
                                  : `Mostrando ${rangeFrom}-${rangeTo} de ${filtered.length} productos`}
                        </span>
                        {activeCat !== "Todos" && (
                            <span className="results-cat">— {activeCat}</span>
                        )}
                    </div>

                    {loading ? (
                        <div className="shop-empty text-center py-5">
                            <div
                                className="spinner-border text-success"
                                role="status"
                            ></div>
                            <p className="mt-3 text-muted">
                                Cargando productos...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="shop-empty">
                            <i className="bi bi-exclamation-triangle fs-1 text-muted"></i>
                            <p>No se pudo cargar el catálogo.</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="shop-empty">
                            <i className="bi bi-search fs-1 text-muted"></i>
                            <p>No se encontraron productos.</p>
                        </div>
                    ) : (
                        <div className="shop-grid">
                            {paginated.map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/producto/${product.id}`}
                                    className="text-decoration-none text-dark"
                                >
                                <div
                                    className="product-card rounded-3 overflow-hidden position-relative"
                                >
                                    {product.tag && (
                                        <span
                                            className={`product-tag ${product.tagColor}`}
                                        >
                                            {product.tag}
                                        </span>
                                    )}
                                    <button
                                        className={`btn-favorite${
                                            isFavorite(product.id)
                                                ? " favorited"
                                                : ""
                                        }`}
                                        onClick={(e) =>
                                            handleToggleFavorite(e, product.id)
                                        }
                                        title={
                                            isFavorite(product.id)
                                                ? "Remover de favoritos"
                                                : "Agregar a favoritos"
                                        }
                                    >
                                        <i
                                            className={`bi ${
                                                isFavorite(product.id)
                                                    ? "bi-heart-fill"
                                                    : "bi-heart"
                                            }`}
                                        ></i>
                                    </button>
                                    {inCart(product.id) > 0 && (
                                        <span className="in-cart-badge">
                                            <i className="bi bi-cart-check"></i>{" "}
                                            {inCart(product.id)}
                                        </span>
                                    )}
                                    <div className="product-img-wrap">
                                        <img
                                            src={product.img}
                                            alt={product.name}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <p className="product-cat mb-1">
                                            {product.category}
                                        </p>
                                        <p className="product-name mb-2">
                                            {product.name}
                                        </p>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <span className="product-price">
                                                    S/{" "}
                                                    {product.price.toFixed(2)}
                                                </span>
                                                <span className="product-unit ms-1">
                                                    / {product.unit}
                                                </span>
                                            </div>
                                            <button
                                                className={`btn-add-cart${added === product.id ? " added" : ""}`}
                                                onClick={(e) => handleAdd(e, product)}
                                                title="Agregar al carrito"
                                                disabled={product.stock <= 0}
                                            >
                                                <i
                                                    className={`bi ${added === product.id ? "bi-check-lg" : "bi-plus-lg"}`}
                                                ></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {!loading && filtered.length > PAGE_SIZE && (
                        <nav className="mt-4 shop-pagination" aria-label="Paginación de productos">
                            <ul className="pagination pagination-sm justify-content-center mb-0 gap-1">
                                <li
                                    className={`page-item ${page === 1 ? "disabled" : ""}`}
                                >
                                    <button
                                        type="button"
                                        className="page-link border-0 rounded-2"
                                        onClick={() =>
                                            setPage((p) => Math.max(1, p - 1))
                                        }
                                        disabled={page === 1}
                                    >
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                </li>
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1,
                                ).map((n) => (
                                    <li key={n}>
                                        <button
                                            type="button"
                                            className={`page-link border-0 rounded-2 fw-bold ${page === n ? "shop-pagination-active" : "shop-pagination-inactive"}`}
                                            onClick={() => setPage(n)}
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                            }}
                                        >
                                            {n}
                                        </button>
                                    </li>
                                ))}
                                <li
                                    className={`page-item ${page === totalPages ? "disabled" : ""}`}
                                >
                                    <button
                                        type="button"
                                        className="page-link border-0 rounded-2"
                                        onClick={() =>
                                            setPage((p) =>
                                                Math.min(totalPages, p + 1),
                                            )
                                        }
                                        disabled={page === totalPages}
                                    >
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </main>
            </div>
        </div>
    );
}
