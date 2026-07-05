import { usePodcasts } from "../context/PodcastContext.jsx";

/** @type {{ value: import('../utils/podcastUtils.js').SortOption, label: string }[]} */
const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
];

/**
 * Dropdown for selecting how podcasts are sorted.
 * @returns {JSX.Element}
 */
export default function SortControls() {
  const { sortBy, setSortBy } = usePodcasts();

  return (
    <div className="control-group">
      <label htmlFor="sort" className="control-label">
        Sort by
      </label>
      <select
        id="sort"
        className="control-select"
        value={sortBy}
        onChange={(event) =>
          setSortBy(/** @type {import('../utils/podcastUtils.js').SortOption} */ (event.target.value))
        }
        aria-label="Sort podcasts"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
