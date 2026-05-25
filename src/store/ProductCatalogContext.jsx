import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

const ProductCatalogContext = createContext(null);

export function ProductCatalogProvider({ children }) {
    const [version, setVersion] = useState(0);

    const invalidate = useCallback(() => {
        setVersion((v) => v + 1);
    }, []);

    const value = useMemo(
        () => ({ version, invalidate }),
        [version, invalidate],
    );

    return (
        <ProductCatalogContext.Provider value={value}>
            {children}
        </ProductCatalogContext.Provider>
    );
}

export function useProductCatalog() {
    const ctx = useContext(ProductCatalogContext);
    if (!ctx) {
        throw new Error(
            "useProductCatalog debe usarse dentro de ProductCatalogProvider",
        );
    }
    return ctx;
}
