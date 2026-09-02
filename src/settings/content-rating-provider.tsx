"use client";

import * as React from "react";

const STORAGE_KEY = "content-rating-pg-only";

type ContentRatingContextValue = {
  pgOnly: boolean;
  setPgOnly: (value: boolean) => void;
};

const ContentRatingContext =
  React.createContext<ContentRatingContextValue | null>(null);

export function ContentRatingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pgOnly, setPgOnlyState] = React.useState(true);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setPgOnlyState(stored === "true");
      }
    } catch {
      // localStorage unavailable, keep the safe default
    }
  }, []);

  const setPgOnly = React.useCallback((value: boolean) => {
    setPgOnlyState(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // ignore write failures
    }
  }, []);

  const value = React.useMemo(() => ({ pgOnly, setPgOnly }), [pgOnly, setPgOnly]);

  return (
    <ContentRatingContext.Provider value={value}>
      {children}
    </ContentRatingContext.Provider>
  );
}

export function useContentRating() {
  const context = React.useContext(ContentRatingContext);
  if (!context) {
    throw new Error(
      "useContentRating must be used within a ContentRatingProvider",
    );
  }
  return context;
}
