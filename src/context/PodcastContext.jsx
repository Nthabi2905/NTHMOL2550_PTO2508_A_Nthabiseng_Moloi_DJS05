import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { fetchPodcasts } from "../services/api.js";
import {
  buildBrowseSearchParams,
  getTotalPages,
  ITEMS_PER_PAGE,
  paginatePodcasts,
  processPodcasts,
  readBrowseStateFromParams,
} from "../utils/podcastUtils.js";

/** @typedef {import('../utils/podcastUtils.js').Podcast} Podcast */
/** @typedef {import('../utils/podcastUtils.js').SortOption} SortOption */

/**
 * @typedef {Object} PodcastContextValue
 * @property {Podcast[]} podcasts - All podcasts loaded from the API.
 * @property {Podcast[]} visiblePodcasts - Current page of processed results.
 * @property {Podcast[]} processedPodcasts - Full filtered/sorted list before pagination.
 * @property {boolean} loading - Whether the initial fetch is in progress.
 * @property {string|null} error - Error message from the API fetch, if any.
 * @property {string} searchQuery
 * @property {SortOption} sortBy
 * @property {number[]} selectedGenres
 * @property {number} currentPage
 * @property {number} totalPages
 * @property {number} totalResults
 * @property {number} itemsPerPage
 * @property {(query: string) => void} setSearchQuery
 * @property {(sort: SortOption) => void} setSortBy
 * @property {(genreId: number) => void} toggleGenre
 * @property {() => void} clearGenres
 * @property {(page: number) => void} setCurrentPage
 */

/** @type {React.Context<PodcastContextValue|null>} */
const PodcastContext = createContext(null);

/**
 * Provides centralised state for search, sort, filter, and pagination.
 * Syncs browse state to URL search params so filters persist when navigating back.
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export function PodcastProvider({ children }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isHomePage = location.pathname === "/";
  const initialState = readBrowseStateFromParams(searchParams);

  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQueryState] = useState(initialState.searchQuery);
  const [sortBy, setSortByState] = useState(initialState.sortBy);
  const [selectedGenres, setSelectedGenres] = useState(initialState.selectedGenres);
  const [currentPage, setCurrentPageState] = useState(initialState.currentPage);

  useEffect(() => {
    let cancelled = false;

    async function loadPodcasts() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPodcasts();
        if (!cancelled) setPodcasts(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPodcasts();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHomePage) return;

    const fromUrl = readBrowseStateFromParams(searchParams);
    setSearchQueryState(fromUrl.searchQuery);
    setSortByState(fromUrl.sortBy);
    setSelectedGenres(fromUrl.selectedGenres);
    setCurrentPageState(fromUrl.currentPage);
  }, [searchParams, isHomePage]);

  useEffect(() => {
    if (!isHomePage) return;

    const nextParams = buildBrowseSearchParams({
      searchQuery,
      selectedGenres,
      sortBy,
      currentPage,
    });

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchQuery, selectedGenres, sortBy, currentPage, isHomePage, searchParams, setSearchParams]);

  const processedPodcasts = useMemo(
    () => processPodcasts(podcasts, { searchQuery, selectedGenres, sortBy }),
    [podcasts, searchQuery, selectedGenres, sortBy]
  );

  const totalResults = processedPodcasts.length;
  const totalPages = getTotalPages(totalResults, ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages);

  const visiblePodcasts = useMemo(
    () => paginatePodcasts(processedPodcasts, safePage, ITEMS_PER_PAGE),
    [processedPodcasts, safePage]
  );

  /**
   * Updates search query and resets to page 1.
   * @param {string} query
   */
  const setSearchQuery = (query) => {
    setSearchQueryState(query);
    setCurrentPageState(1);
  };

  /**
   * Updates sort option and resets to page 1.
   * @param {SortOption} sort
   */
  const setSortBy = (sort) => {
    setSortByState(sort);
    setCurrentPageState(1);
  };

  /**
   * Toggles a genre in the multi-select filter and resets to page 1.
   * @param {number} genreId
   */
  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
    setCurrentPageState(1);
  };

  /** Clears all selected genre filters and resets to page 1. */
  const clearGenres = () => {
    setSelectedGenres([]);
    setCurrentPageState(1);
  };

  /**
   * Navigates to a specific page while preserving other filter state.
   * @param {number} page
   */
  const setCurrentPage = (page) => {
    setCurrentPageState(Math.max(1, Math.min(page, totalPages)));
  };

  const value = {
    podcasts,
    visiblePodcasts,
    processedPodcasts,
    loading,
    error,
    searchQuery,
    sortBy,
    selectedGenres,
    currentPage: safePage,
    totalPages,
    totalResults,
    itemsPerPage: ITEMS_PER_PAGE,
    setSearchQuery,
    setSortBy,
    toggleGenre,
    clearGenres,
    setCurrentPage,
  };

  return (
    <PodcastContext.Provider value={value}>{children}</PodcastContext.Provider>
  );
}

/**
 * Accesses the podcast browsing context.
 * @returns {PodcastContextValue}
 */
export function usePodcasts() {
  const context = useContext(PodcastContext);
  if (!context) {
    throw new Error("usePodcasts must be used within a PodcastProvider");
  }
  return context;
}
