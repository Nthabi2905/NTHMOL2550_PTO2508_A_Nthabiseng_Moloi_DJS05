/**
 * @typedef {Object} Podcast
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} seasons
 * @property {string} image
 * @property {number[]} genres
 * @property {string} updated
 */

/** @typedef {'newest' | 'title-asc' | 'title-desc'} SortOption */

export const ITEMS_PER_PAGE = 12;

/**
 * Filters podcasts whose title contains the search query (case-insensitive).
 * @param {Podcast[]} podcasts - Full podcast list.
 * @param {string} query - User search string.
 * @returns {Podcast[]} Podcasts matching the search query.
 */
export function filterBySearch(podcasts, query) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return podcasts;

  return podcasts.filter((podcast) =>
    podcast.title.toLowerCase().includes(trimmed)
  );
}

/**
 * Filters podcasts that belong to at least one of the selected genre IDs.
 * When no genres are selected, all podcasts pass through.
 * @param {Podcast[]} podcasts - Podcast list to filter.
 * @param {number[]} selectedGenres - Active genre ID filters.
 * @returns {Podcast[]} Podcasts matching the genre filter.
 */
export function filterByGenres(podcasts, selectedGenres) {
  if (selectedGenres.length === 0) return podcasts;

  return podcasts.filter((podcast) =>
    podcast.genres.some((genreId) => selectedGenres.includes(genreId))
  );
}

/**
 * Sorts podcasts according to the chosen sort option.
 * @param {Podcast[]} podcasts - Podcast list to sort (mutates a copy).
 * @param {SortOption} sortBy - Active sort option.
 * @returns {Podcast[]} Sorted podcast array.
 */
export function sortPodcasts(podcasts, sortBy) {
  const sorted = [...podcasts];

  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
      );
    case "title-asc":
      return sorted.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      );
    case "title-desc":
      return sorted.sort((a, b) =>
        b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
      );
    default:
      return sorted;
  }
}

/**
 * Returns a single page slice from a filtered and sorted podcast list.
 * @param {Podcast[]} podcasts - Processed podcast list.
 * @param {number} page - 1-based page number.
 * @param {number} [pageSize=ITEMS_PER_PAGE] - Items per page.
 * @returns {Podcast[]} Podcasts for the requested page.
 */
export function paginatePodcasts(podcasts, page, pageSize = ITEMS_PER_PAGE) {
  const start = (page - 1) * pageSize;
  return podcasts.slice(start, start + pageSize);
}

/**
 * Calculates total pages for a given result count.
 * @param {number} totalItems - Number of items after filtering.
 * @param {number} [pageSize=ITEMS_PER_PAGE] - Items per page.
 * @returns {number} Total number of pages (minimum 1).
 */
export function getTotalPages(totalItems, pageSize = ITEMS_PER_PAGE) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

/**
 * Applies search, genre filter, and sort in sequence to produce the final list.
 * @param {Podcast[]} podcasts - Raw podcast data from the API.
 * @param {Object} options - Active filter and sort state.
 * @param {string} options.searchQuery
 * @param {number[]} options.selectedGenres
 * @param {SortOption} options.sortBy
 * @returns {Podcast[]} Fully processed podcast list.
 */
export function processPodcasts(podcasts, { searchQuery, selectedGenres, sortBy }) {
  const searched = filterBySearch(podcasts, searchQuery);
  const filtered = filterByGenres(searched, selectedGenres);
  return sortPodcasts(filtered, sortBy);
}

/**
 * Formats an ISO date string for display.
 * @param {string} isoDate - ISO 8601 date string.
 * @returns {string} Localised date string.
 */
export function formatUpdatedDate(isoDate) {
  if (!isoDate) return "Date unavailable";

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Reads browse state from URL search parameters.
 * @param {URLSearchParams} searchParams
 * @returns {{ searchQuery: string, selectedGenres: number[], sortBy: SortOption, currentPage: number }}
 */
export function readBrowseStateFromParams(searchParams) {
  const sortParam = searchParams.get("sort");
  const validSorts = /** @type {SortOption[]} */ (["newest", "title-asc", "title-desc"]);

  return {
    searchQuery: searchParams.get("q") || "",
    selectedGenres: (searchParams.get("genres") || "")
      .split(",")
      .filter(Boolean)
      .map(Number)
      .filter((id) => !Number.isNaN(id)),
    sortBy: validSorts.includes(/** @type {SortOption} */ (sortParam))
      ? /** @type {SortOption} */ (sortParam)
      : "newest",
    currentPage: Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1),
  };
}

/**
 * Builds URL search parameters from active browse state.
 * @param {Object} state
 * @param {string} state.searchQuery
 * @param {number[]} state.selectedGenres
 * @param {SortOption} state.sortBy
 * @param {number} state.currentPage
 * @returns {URLSearchParams}
 */
export function buildBrowseSearchParams({ searchQuery, selectedGenres, sortBy, currentPage }) {
  const params = new URLSearchParams();

  if (searchQuery.trim()) params.set("q", searchQuery.trim());
  if (selectedGenres.length > 0) params.set("genres", selectedGenres.join(","));
  if (sortBy !== "newest") params.set("sort", sortBy);
  if (currentPage > 1) params.set("page", String(currentPage));

  return params;
}
