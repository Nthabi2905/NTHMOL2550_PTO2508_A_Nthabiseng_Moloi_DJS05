import { useState } from "react";
import { truncateText } from "../utils/truncateText.js";

/** @typedef {import('../services/api.js').Season} Season */

/**
 * Expandable season navigation with episode listings.
 * @param {{ seasons: Season[] }} props
 * @returns {JSX.Element}
 */
export default function SeasonNavigation({ seasons }) {
  const sortedSeasons = [...seasons].sort((a, b) => a.season - b.season);
  const [expandedSeason, setExpandedSeason] = useState(
    sortedSeasons[0]?.season ?? null
  );

  if (!sortedSeasons.length) {
    return <p className="status-message">No seasons available for this show.</p>;
  }

  /**
   * Toggles a season panel open or closed.
   * @param {number} seasonNumber
   */
  const handleSeasonToggle = (seasonNumber) => {
    setExpandedSeason((current) => (current === seasonNumber ? null : seasonNumber));
  };

  return (
    <section className="season-nav" aria-label="Seasons and episodes">
      <h2 className="season-nav__heading">Seasons</h2>
      <div className="season-nav__list">
        {sortedSeasons.map((season) => {
          const isExpanded = expandedSeason === season.season;
          const panelId = `season-panel-${season.season}`;

          return (
            <article key={season.season} className="season-panel">
              <button
                type="button"
                className={`season-panel__header${isExpanded ? " season-panel__header--active" : ""}`}
                onClick={() => handleSeasonToggle(season.season)}
                aria-expanded={isExpanded}
                aria-controls={panelId}
              >
                <span className="season-panel__title">{season.title}</span>
                <span className="season-panel__count">
                  {season.episodes.length} episode{season.episodes.length !== 1 ? "s" : ""}
                </span>
                <span className="season-panel__icon" aria-hidden="true">
                  {isExpanded ? "−" : "+"}
                </span>
              </button>

              {isExpanded && (
                <ul id={panelId} className="episode-list">
                  {season.episodes.map((episode) => (
                    <li key={`${season.season}-${episode.episode}`} className="episode-card">
                      <img
                        src={season.image}
                        alt=""
                        className="episode-card__image"
                        loading="lazy"
                      />
                      <div className="episode-card__content">
                        <p className="episode-card__number">
                          Episode {episode.episode}
                        </p>
                        <h3 className="episode-card__title">{episode.title}</h3>
                        <p className="episode-card__description">
                          {truncateText(episode.description)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
