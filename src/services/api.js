/** @typedef {import('../utils/podcastUtils.js').Podcast} Podcast */

/**
 * @typedef {Object} Episode
 * @property {number} episode
 * @property {string} title
 * @property {string} description
 * @property {string} file
 */

/**
 * @typedef {Object} Season
 * @property {number} season
 * @property {string} title
 * @property {string} image
 * @property {Episode[]} episodes
 */

/**
 * @typedef {Object} Show
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} image
 * @property {string[]} genres
 * @property {string} updated
 * @property {Season[]} seasons
 */

const API_URL = "https://podcast-api.netlify.app";

/**
 * Fetches the full list of podcast previews from the remote API.
 * @returns {Promise<Podcast[]>} Resolves with an array of podcast preview objects.
 * @throws {Error} When the network request fails or the response is not OK.
 */
export async function fetchPodcasts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch podcasts (${response.status})`);
  }

  return response.json();
}

/**
 * Fetches detailed show data including seasons and episodes.
 * @param {string} id - Podcast show ID.
 * @returns {Promise<Show>} Resolves with the full show object.
 * @throws {Error} When the show cannot be found or the request fails.
 */
export async function fetchShow(id) {
  const response = await fetch(`${API_URL}/id/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Show not found. It may have been removed or the link is incorrect.");
    }
    throw new Error(`Failed to fetch show (${response.status})`);
  }

  const data = await response.json();

  if (!data || !data.id) {
    throw new Error("Show not found.");
  }

  return data;
}
