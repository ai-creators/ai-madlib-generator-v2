import * as React from "react";

const STORAGE_KEY = "REACTED_ADLIB_KEYS";

function reactionKey(adlibId: number, reactionType: string): string {
  return `${adlibId}:${reactionType}`;
}

function readReactedKeys(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((key): key is string => typeof key === "string")
      : [];
  } catch {
    return [];
  }
}

export function useReactedAdlibs() {
  const [reactedKeys, setReactedKeys] = React.useState<string[]>([]);

  React.useEffect(() => {
    setReactedKeys(readReactedKeys());
  }, []);

  const hasReacted = React.useCallback(
    (adlibId: number, reactionType: string) =>
      reactedKeys.includes(reactionKey(adlibId, reactionType)),
    [reactedKeys],
  );

  const markReacted = React.useCallback(
    (adlibId: number, reactionType: string) => {
      setReactedKeys((prev) => {
        const key = reactionKey(adlibId, reactionType);
        if (prev.includes(key)) return prev;
        const next = [...prev, key];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  return { hasReacted, markReacted };
}
