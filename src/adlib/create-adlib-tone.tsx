"use client";

import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";

export default function CreateAdlibTone({
  toneId,
  onChange,
}: {
  toneId: number | undefined;
  onChange: (toneId: number | undefined) => void;
}) {
  const { data: tones } = api.tone.getAll.useQuery();

  if (!tones || tones.length === 0) {
    return null;
  }

  const options = [{ id: undefined, style: "Default" }, ...tones];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Tone</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id ?? "default"}
            type="button"
            onClick={() => onChange(option.id)}
            data-cy={`tone-option-${option.id ?? "default"}`}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              toneId === option.id
                ? "border-primary bg-primary/10 text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.style}
          </button>
        ))}
      </div>
    </div>
  );
}
