import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  // Initialize with null to indicate "not determined yet"
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    // Set initial value once we're on the client
    if (matches === null) {
      const media = window.matchMedia(query);
      setMatches(media.matches);
    }

    // Set up listener for changes
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  // Fallback to a sensible default for SSR
  // Desktop-first approach: assume desktop in SSR, correct on client
  return matches === null ? true : matches;
}
