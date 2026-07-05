import { usePodcasts } from "../context/PodcastContext.jsx";

/**
 * Page navigation that preserves active search, sort, and filter state.
 * @returns {JSX.Element|null}
 */
export default function Pagination() {
  const {
    currentPage,
    totalPages,
    totalResults,
    itemsPerPage,
    setCurrentPage,
    loading,
  } = usePodcasts();

  if (loading || totalResults === 0) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalResults);

  /**
   * Builds a compact page number list with ellipsis for large page counts.
   * @returns {(number | 'ellipsis')[]}
   */
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
    const sorted = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);

    /** @type {(number | 'ellipsis')[]} */
    const result = [];
    sorted.forEach((page, index) => {
      if (index > 0 && page - sorted[index - 1] > 1) {
        result.push("ellipsis");
      }
      result.push(page);
    });
    return result;
  };

  return (
    <nav className="pagination" aria-label="Podcast pagination">
      <p className="pagination__summary">
        Showing {start}–{end} of {totalResults}
      </p>
      <div className="pagination__controls">
        <button
          type="button"
          className="btn-pagination"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          Previous
        </button>
        <ul className="pagination__pages">
          {getPageNumbers().map((page, index) =>
            page === "ellipsis" ? (
              <li key={`ellipsis-${index}`} className="pagination__ellipsis" aria-hidden="true">
                …
              </li>
            ) : (
              <li key={page}>
                <button
                  type="button"
                  className={`btn-page${page === currentPage ? " btn-page--active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              </li>
            )
          )}
        </ul>
        <button
          type="button"
          className="btn-pagination"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
