import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useShopProducts } from "../features/products/hooks/useShopProducts";
import FlashProductCard from "../components/landing/FlashProductCard";
import { getTodayDealIdSet } from "../utils/todayDealProducts";
import "../styles/landing.css";

const AISLE_ICONS = {
    Gaseosas: "bi-cup-straw",
    Frutas: "bi-apple",
    "Lácteos": "bi-droplet-half",
    Snacks: "bi-bag-heart",
    Abarrotes: "bi-box-seam",
    Bebidas: "bi-cup-hot",
};

const FILTER_CHIPS = [
    { id: "default", label: "Relevancia" },
    { id: "price-asc", label: "Precio: Menor a Mayor" },
    { id: "price-desc", label: "Precio: Mayor a Menor" },
    { id: "bestseller", label: "Más Vendidos" },
    { id: "brand", label: "Marca (Proveedor)" },
    { id: "discount", label: "Descuento %" },
    { id: "stock", label: "Disponibilidad de Stock" },
];

const PAGE_SIZE = 12;

export default function ShopPage() {
    const [params, setParams] = useSearchParams();
    const { products, categories, loading, error } = useShopProducts();

    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("default");
    const [page, setPage] = useState(1);

    const activeCat = params.get("category") || "Todos";
    const activeTag = params.get("tag") || "";

    useEffect(() => {
        const q = params.get("search");
        if (q) setSearch(q);
    }, [params]);

    const setCat = (cat) => {
        setPage(1);
        const p = new URLSearchParams(params);
        if (cat === "Todos") p.delete("category");
        else p.set("category", cat);
        setParams(p);
    };

    const filtered = useMemo(() => {
        let list = [...products];
        if (activeCat !== "Todos") {
            list = list.filter((p) => p.category === activeCat);
        }
        if (activeTag) {
            list = list.filter((p) => p.tag === activeTag);
        }
        if (search.trim()) {
            list = list.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase()),
            );
        }
        switch (activeFilter) {
            case "price-asc":
                list.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                list.sort((a, b) => b.price - a.price);
                break;
            case "bestseller":
                list.sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0));
                break;
            case "brand":
                list.sort((a, b) =>
                    String(a.category || "").localeCompare(
                        String(b.category || ""),
                        "es",
                    ),
                );
                break;
            case "discount":
                list = list.filter((p) => p.tag);
                break;
            case "stock":
                list = list.filter((p) => (p.stock ?? 0) > 0);
                break;
            default:
                break;
        }
        return list;
    }, [products, activeCat, activeTag, search, activeFilter]);

    const todayDealIds = useMemo(
        () => getTodayDealIdSet(products.map((p) => p.id)),
        [products],
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const rangeFrom = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const rangeTo = Math.min(page * PAGE_SIZE, filtered.length);

    useEffect(() => {
        setPage(1);
    }, [search, activeFilter, activeCat, activeTag]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    return (
        <div className="shop-page landing-page">
            <div className="container landing-aisle-section py-4">
                <div className="landing-aisle-layout shop-catalog-layout">
                    <aside className="landing-aisle-sidebar shop-aisle-card">
                        <p className="landing-aisle-eyebrow">Shop by aisle</p>
                        <h3 className="landing-aisle-title">Categories</h3>
                        <ul className="landing-aisle-list">
                            {["Todos", ...categories].map((cat) => (
                                <li key={cat}>
                                    <button
                                        type="button"
                                        className={`landing-aisle-item${activeCat === cat ? " active" : ""}`}
                                        onClick={() => setCat(cat)}
                                    >
                                        <i
                                            className={`bi ${
                                                cat === "Todos"
                                                    ? "bi-grid"
                                                    : AISLE_ICONS[cat] || "bi-tag"
                                            }`}
                                        />
                                        <span>{cat}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <Link to="/shop" className="landing-aisle-shop-link">
                            Ver tienda completa <i className="bi bi-arrow-right" />
                        </Link>
                    </aside>

                    <div className="landing-aisle-main shop-catalog-main">
                        <div className="shop-inline-search mb-3">
                            <i className="bi bi-search shop-inline-search-icon" />
                            <input
                                type="text"
                                className="form-control shop-inline-search-input"
                                placeholder="Buscar en tienda..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    type="button"
                                    className="shop-inline-search-clear"
                                    onClick={() => setSearch("")}
                                    aria-label="Limpiar búsqueda"
                                >
                                    <i className="bi bi-x-lg" />
                                </button>
                            )}
                        </div>

                        <div className="landing-filters-bar">
                            {FILTER_CHIPS.map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    className={`landing-filter-chip${activeFilter === f.id ? " active" : ""}`}
                                    onClick={() => setActiveFilter(f.id)}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        <div className="shop-results-header mb-3">
                            <span className="results-count">
                                {loading
                                    ? "Cargando..."
                                    : filtered.length === 0
                                      ? "0 productos"
                                      : `Mostrando ${rangeFrom}-${rangeTo} de ${filtered.length} productos`}
                            </span>
                            {activeCat !== "Todos" && (
                                <span className="results-cat ms-2">— {activeCat}</span>
                            )}
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-success" role="status" />
                                <p className="mt-3 text-muted">Cargando productos...</p>
                            </div>
                        ) : error ? (
                            <div className="shop-empty">
                                <i className="bi bi-exclamation-triangle fs-1 text-muted" />
                                <p>No se pudo cargar el catálogo.</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="shop-empty">
                                <i className="bi bi-search fs-1 text-muted" />
                                <p>No se encontraron productos.</p>
                            </div>
                        ) : (
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 shop-product-grid">
                                {paginated.map((product) => (
                                    <div key={product.id} className="col">
                                        <FlashProductCard
                                            p={product}
                                            showTodayDeal={todayDealIds.has(
                                                product.id,
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading && filtered.length > PAGE_SIZE && (
                            <nav className="mt-4 shop-pagination" aria-label="Paginación de productos">
                                <ul className="pagination pagination-sm justify-content-center mb-0 gap-1">
                                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                        <button
                                            type="button"
                                            className="page-link border-0 rounded-2"
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            <i className="bi bi-chevron-left" />
                                        </button>
                                    </li>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                        <li key={n}>
                                            <button
                                                type="button"
                                                className={`page-link border-0 rounded-2 fw-bold ${page === n ? "shop-pagination-active" : "shop-pagination-inactive"}`}
                                                onClick={() => setPage(n)}
                                                style={{ width: "32px", height: "32px" }}
                                            >
                                                {n}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                                        <button
                                            type="button"
                                            className="page-link border-0 rounded-2"
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                        >
                                            <i className="bi bi-chevron-right" />
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
