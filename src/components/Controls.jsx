import SearchBar from "./SearchBar.jsx";
import SortControls from "./SortControls.jsx";
import GenreFilter from "./GenreFilter.jsx";

/**
 * Groups search, sort, and filter controls in a single toolbar.
 * @returns {JSX.Element}
 */
export default function Controls() {
  return (
    <section className="controls" aria-label="Browse controls">
      <div className="controls__row">
        <SearchBar />
        <SortControls />
      </div>
      <GenreFilter />
    </section>
  );
}
