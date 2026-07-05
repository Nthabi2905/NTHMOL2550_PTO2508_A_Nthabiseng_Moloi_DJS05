/**
 * Shortens long text for compact UI previews.
 * @param {string} text - Source text.
 * @param {number} [maxLength=120] - Maximum visible characters before truncation.
 * @returns {string} Original or truncated text with an ellipsis.
 */
export function truncateText(text, maxLength = 120) {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  const trimmed = text.slice(0, maxLength).trimEnd();
  const lastSpace = trimmed.lastIndexOf(" ");
  const safeCut = lastSpace > maxLength * 0.6 ? trimmed.slice(0, lastSpace) : trimmed;

  return `${safeCut}…`;
}
