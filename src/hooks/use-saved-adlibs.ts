import * as React from "react";

const STORAGE_KEY = "SAVED_ADLIB_IDS";

function readSavedIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is number => typeof id === "number")
      : [];
  } catch {
    return [];
  }
}

export function useSavedAdlibs() {
  const [savedIds, setSavedIds] = React.useState<number[]>([]);

  React.useEffect(() => {
    setSavedIds(readSavedIds());
  }, []);

  const isSaved = React.useCallback(
    (adlibId: number) => savedIds.includes(adlibId),
    [savedIds],
  );

  const toggleSaved = React.useCallback((adlibId: number) => {
    setSavedIds((prev) => {
      const next = prev.includes(adlibId)
        ? prev.filter((id) => id !== adlibId)
        : [...prev, adlibId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { savedIds, isSaved, toggleSaved };
}
