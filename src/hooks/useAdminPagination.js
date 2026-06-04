import { useEffect, useMemo, useState } from "react";

export function useAdminPagination(items, itemsPerPage = 10) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = useMemo(
        () => items.slice(indexOfFirstItem, indexOfLastItem),
        [items, indexOfFirstItem, indexOfLastItem],
    );

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const paginate = (page) => {
        setCurrentPage(Math.min(Math.max(1, page), totalPages));
    };

    const resetPage = () => setCurrentPage(1);

    return {
        currentPage,
        totalPages,
        totalItems,
        indexOfFirstItem,
        indexOfLastItem,
        currentItems,
        paginate,
        resetPage,
        setCurrentPage,
    };
}
