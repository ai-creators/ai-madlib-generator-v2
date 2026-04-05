"use client";

import { cn } from "@/lib/utils";
import { useAdlibFeedStore } from "./adlib-feed-store";

export default function AdlibFeedSelect({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { feedOption, availableOptions, setFeedOption } = useAdlibFeedStore();

  return (
    <div
      className={cn(className, "bg-muted flex gap-1 rounded-lg border p-1")}
      {...props}
    >
      {availableOptions.map((option) => (
        <button
          key={option}
          onClick={() => setFeedOption(option)}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
            feedOption === option
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
