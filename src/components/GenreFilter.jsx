import { genres } from "../data/genres.js";
import { usePodcasts } from "../context/PodcastContext.jsx";

/**
 * Multi-select genre filter using checkboxes.
 * Selected genres persist across pagination and other controls.
 * @returns {JSX.Element}
 */
export default function GenreFilter() {
  const { selectedGenres, toggleGenre, clearGenres } = usePodcasts();

  return (
    <fieldset className="control-group genre-filter">
      <legend className="control-label">Filter by genre</legend>
      <div className="genre-options">
        {genres.map((genre) => (
          <label key={genre.id} className="genre-option">
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre.id)}
              onChange={() => toggleGenre(genre.id)}
            />
            <span>{genre.title}</span>
          </label>
        ))}
      </div>
      {selectedGenres.length > 0 && (
        <button type="button" className="btn-text" onClick={clearGenres}>
          Clear filters
        </button>
      )}
    </fieldset>
  );
}
