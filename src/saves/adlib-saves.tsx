"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useSavedAdlibs } from "@/hooks/use-saved-adlibs";
import AdlibFeedCard from "@/feed/adlib-feed-card";

export default function AdlibSaves() {
  const { savedIds } = useSavedAdlibs();

  const {
    data: savedAdlibs,
    isLoading,
    error,
  } = api.adlib.getSaves.useQuery({ ids: savedIds });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Adlibs</CardTitle>
        <CardDescription>Adlibs you&apos;ve bookmarked</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">
            Loading saved adlibs...
          </p>
        ) : error ? (
          <p className="text-destructive text-sm">
            Error loading saved adlibs: {error.message}
          </p>
        ) : !savedAdlibs || savedAdlibs.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No saved adlibs yet
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {savedAdlibs.map((adlib) => (
              <li key={adlib.id} className="p-0.5">
                <AdlibFeedCard adlib={adlib} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
