import { usePodcasts } from "../context/PodcastContext.jsx";
import PodcastCard from "./PodcastCard.jsx";

/**
 * Renders the current page of podcast results or appropriate empty/loading states.
 * @returns {JSX.Element}
 */
export default function PodcastList() {
  const { visiblePodcasts, loading, error, totalResults, searchQuery, selectedGenres } =
    usePodcasts();

  if (loading) {
    return <p className="status-message">Loading podcasts…</p>;
  }

  if (error) {
    return (
      <p className="status-message status-message--error" role="alert">
        {error}
      </p>
    );
  }

  if (totalResults === 0) {
    const hasFilters = searchQuery.trim() || selectedGenres.length > 0;
    return (
      <p className="status-message">
        {hasFilters
          ? "No podcasts match your search and filters. Try adjusting your criteria."
          : "No podcasts available."}
      </p>
    );
  }

  return (
    <ul className="podcast-list">
      {visiblePodcasts.map((podcast) => (
        <li key={podcast.id}>
          <PodcastCard podcast={podcast} />
        </li>
      ))}
    </ul>
  );
}
