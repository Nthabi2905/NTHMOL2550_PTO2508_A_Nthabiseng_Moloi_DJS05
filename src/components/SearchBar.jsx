import { usePodcasts } from "../context/PodcastContext.jsx";

/**
 * Live search input that filters podcasts by title as the user types.
 * @returns {JSX.Element}
 */
export default function SearchBar() {
  const { searchQuery, setSearchQuery } = usePodcasts();

  return (
    <div className="control-group">
      <label htmlFor="search" className="control-label">
        Search
      </label>
      <input
        id="search"
        type="search"
        className="control-input"
        placeholder="Search by podcast title…"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        aria-label="Search podcasts by title"
      />
    </div>
  );
}
