"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSavedAdlibs } from "@/hooks/use-saved-adlibs";
import { cn } from "@/lib/utils";

export default function AdlibSaveButton({
  adlibId,
  className,
}: {
  adlibId: number;
  className?: string;
}) {
  const { isSaved, toggleSaved } = useSavedAdlibs();
  const saved = isSaved(adlibId);

  const handleClick = () => {
    toggleSaved(adlibId);
    toast.success(saved ? "Removed from saves" : "Adlib saved");
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(className)}
      aria-label={saved ? "Unsave adlib" : "Save adlib"}
      data-cy="save-adlib-btn"
      onClick={handleClick}
    >
      {saved ? <BookmarkCheck /> : <Bookmark />}
    </Button>
  );
}
