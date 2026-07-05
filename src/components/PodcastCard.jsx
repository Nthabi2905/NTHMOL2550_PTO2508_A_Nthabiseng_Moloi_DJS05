import { Link } from "react-router-dom";
import { genreTitleById } from "../data/genres.js";
import { formatUpdatedDate } from "../utils/podcastUtils.js";

/** @typedef {import('../utils/podcastUtils.js').Podcast} Podcast */

/**
 * Clickable podcast preview card that links to the show detail page.
 * @param {{ podcast: Podcast }} props
 * @returns {JSX.Element}
 */
export default function PodcastCard({ podcast }) {
  const genreLabels = podcast.genres
    .map((id) => genreTitleById.get(id))
    .filter(Boolean);

  return (
    <article className="podcast-card">
      <Link to={`/show/${podcast.id}`} className="podcast-card__link">
        <img
          src={podcast.image}
          alt=""
          className="podcast-card__image"
          loading="lazy"
        />
        <div className="podcast-card__body">
          <h2 className="podcast-card__title">{podcast.title}</h2>
          <p className="podcast-card__meta">
            {podcast.seasons} season{podcast.seasons !== 1 ? "s" : ""} · Updated{" "}
            {formatUpdatedDate(podcast.updated)}
          </p>
          <p className="podcast-card__description">{podcast.description}</p>
          {genreLabels.length > 0 && (
            <ul className="podcast-card__genres" aria-label="Genres">
              {genreLabels.map((label) => (
                <li key={label} className="genre-tag">
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  );
}
