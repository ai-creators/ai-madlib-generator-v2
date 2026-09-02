"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAdlibFeedStore } from "./adlib-feed-store";

export default function AdlibFeedSearch({
  className,
}: {
  className?: string;
}) {
  const { search, setSearch } = useAdlibFeedStore();
  const [value, setValue] = React.useState(search);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(value);
    }, 300);
    return () => clearTimeout(timeout);
  }, [value, setSearch]);

  return (
    <div className={className}>
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search adlibs..."
          className="pl-9"
          data-cy="adlib-search-input"
        />
      </div>
    </div>
  );
}
