"use client";

import { useContentRating } from "./content-rating-provider";

export default function ContentRatingToggle() {
  const { pgOnly, setPgOnly } = useContentRating();

  const options: { label: string; value: boolean }[] = [
    { label: "PG only", value: true },
    { label: "All content", value: false },
  ];

  return (
    <div className="bg-muted flex w-fit gap-1 rounded-lg border p-1">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          onClick={() => setPgOnly(option.value)}
          data-cy={`content-rating-${option.value ? "pg" : "all"}-btn`}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            pgOnly === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
