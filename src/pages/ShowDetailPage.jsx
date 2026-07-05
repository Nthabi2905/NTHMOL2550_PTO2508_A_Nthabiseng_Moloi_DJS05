import { Link, useParams } from "react-router-dom";
import { useShow } from "../hooks/useShow.js";
import { formatUpdatedDate } from "../utils/podcastUtils.js";
import SeasonNavigation from "../components/SeasonNavigation.jsx";

/**
 * Dynamic show detail page fetched by route parameter ID.
 * @returns {JSX.Element}
 */
export default function ShowDetailPage() {
  const { id } = useParams();
  const { show, loading, error } = useShow(id);

  if (loading) {
    return (
      <div className="app show-page">
        <p className="status-message" role="status">
          <span className="spinner" aria-hidden="true" />
          Loading show details…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app show-page">
        <Link to="/" className="back-link">
          ← Back to podcasts
        </Link>
        <p className="status-message status-message--error" role="alert">
          {error}
        </p>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="app show-page">
        <Link to="/" className="back-link">
          ← Back to podcasts
        </Link>
        <p className="status-message">Show not found.</p>
      </div>
    );
  }

  const genreTags = Array.isArray(show.genres)
    ? show.genres.filter((genre) => !["All", "Featured"].includes(genre))
    : [];

  return (
    <div className="app show-page">
      <Link to="/" className="back-link">
        ← Back to podcasts
      </Link>

      <header className="show-hero">
        <img
          src={show.image}
          alt=""
          className="show-hero__image"
        />
        <div className="show-hero__content">
          <h1 className="show-hero__title">{show.title}</h1>
          <p className="show-hero__updated">
            Last updated {formatUpdatedDate(show.updated)}
          </p>
          {genreTags.length > 0 && (
            <ul className="show-hero__genres" aria-label="Genres">
              {genreTags.map((genre) => (
                <li key={genre} className="genre-tag">
                  {genre}
                </li>
              ))}
            </ul>
          )}
          <p className="show-hero__description">{show.description}</p>
        </div>
      </header>

      <SeasonNavigation seasons={show.seasons} />
    </div>
  );
}
