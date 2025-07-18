import { useMemo } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const visiblePages = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = [];

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="pagination-container flex items-center gap-2 mt-6">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      {visiblePages.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2">...</span>
        ) : (
          <button
            key={`page-${index}-${page}`}
            className={`px-3 py-1 border rounded ${
              currentPage === page ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
