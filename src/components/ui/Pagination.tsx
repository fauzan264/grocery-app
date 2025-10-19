export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const generatePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 4) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 3) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="join flex justify-center mt-4">
      <button
        className="join-item btn btn-sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        «
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <button key={idx} className="join-item btn btn-sm btn-disabled">
            ...
          </button>
        ) : (
          <button
            key={idx}
            className={`join-item btn btn-sm ${
              page === currentPage ? "btn-active" : ""
            }`}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </button>
        )
      )}

      <button
        className="join-item btn btn-sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        »
      </button>
    </div>
  );
}
