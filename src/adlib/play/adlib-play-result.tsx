"use client";

import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RouterOutputs } from "@/trpc/react";
import AdlibSaveButton from "@/adlib/adlib-save-button";
import AdlibReactions from "@/adlib/reactions/adlib-reactions";

type AdlibResult = RouterOutputs["adlib"]["getResultById"];

const BOLD_MARKER = /(\*\*.+?\*\*)/g;
const BOLD_MARKER_GROUP = /^\*\*(.+)\*\*$/;

function renderStory(text: string) {
  return text.split(BOLD_MARKER).map((part, index) => {
    const match = BOLD_MARKER_GROUP.exec(part);
    if (match) {
      return (
        <strong key={index} className="text-primary font-semibold">
          {match[1]}
        </strong>
      );
    }
    return part;
  });
}

export default function AdlibPlayResult({ result }: { result: AdlibResult }) {
  const handleCopy = async () => {
    try {
      const plainText = result.resultText.replace(/\*\*/g, "");
      await navigator.clipboard.writeText(plainText);
      toast.success("Story copied to clipboard!");
    } catch {
      toast.error("Failed to copy story");
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle>{result.adlibTitle}</CardTitle>
          <CardDescription>{result.adlibPrompt}</CardDescription>
        </div>
        <div className="flex items-center gap-1">
          <AdlibSaveButton adlibId={result.adlibId} />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Copy story"
            data-cy="copy-story-btn"
            onClick={handleCopy}
          >
            <Copy />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {renderStory(result.resultText)}
        </p>
        <AdlibReactions adlibId={result.adlibId} />
      </CardContent>
    </Card>
  );
}
