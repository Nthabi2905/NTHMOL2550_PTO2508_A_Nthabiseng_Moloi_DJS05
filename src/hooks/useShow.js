import { useEffect, useState } from "react";
import { fetchShow } from "../services/api.js";

/** @typedef {import('../services/api.js').Show} Show */

/**
 * Fetches and manages show detail data for a given podcast ID.
 * @param {string | undefined} showId - Podcast ID from the route.
 * @returns {{ show: Show | null, loading: boolean, error: string | null }}
 */
export function useShow(showId) {
  const [show, setShow] = useState(/** @type {Show | null} */ (null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(/** @type {string | null} */ (null));

  useEffect(() => {
    if (!showId) {
      setShow(null);
      setLoading(false);
      setError("No show ID provided.");
      return;
    }

    let cancelled = false;

    async function loadShow() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchShow(showId);
        if (!cancelled) setShow(data);
      } catch (err) {
        if (!cancelled) {
          setShow(null);
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadShow();

    return () => {
      cancelled = true;
    };
  }, [showId]);

  return { show, loading, error };
}
