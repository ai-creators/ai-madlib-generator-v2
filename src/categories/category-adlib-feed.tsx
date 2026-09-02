"use client";

import * as React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdlibFeedCard from "@/feed/adlib-feed-card";
import { FeedOption } from "@/feed/feed-option";
import type { RouterOutputs } from "@/trpc/react";
import { useContentRating } from "@/settings/content-rating-provider";

const PAGE_SIZE = 25;

export default function CategoryAdlibFeed({ category }: { category: string }) {
  const { pgOnly } = useContentRating();
  const [timestamp] = React.useState(() => new Date());
  const [page, setPage] = React.useState(1);
  const [adlibs, setAdlibs] = React.useState<
    RouterOutputs["adlib"]["getFeed"]["data"]
  >([]);
  const [hasMore, setHasMore] = React.useState(true);

  const { data } = api.adlib.getFeed.useQuery({
    page,
    size: PAGE_SIZE,
    timestamp,
    feedOption: FeedOption.Latest,
    category,
    pgOnly,
  });

  React.useEffect(() => {
    if (!data) return;
    if (page === 1) {
      setAdlibs(data.data);
    } else {
      setAdlibs((prev) => [...prev, ...data.data]);
    }
    if (data.data.length < PAGE_SIZE) {
      setHasMore(false);
    }
  }, [data, page]);

  React.useEffect(() => {
    setPage(1);
    setAdlibs([]);
    setHasMore(true);
  }, [pgOnly]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">#{category}</CardTitle>
        <CardDescription>View adlibs in this category</CardDescription>
      </CardHeader>
      <CardContent>
        <InfiniteScroll
          dataLength={adlibs.length}
          next={() => setPage((p) => p + 1)}
          hasMore={hasMore}
          loader={
            <p className="text-muted-foreground py-4 text-center text-sm">
              Loading...
            </p>
          }
          endMessage={
            <p className="text-muted-foreground py-4 text-center text-sm">
              You&apos;ve seen all the adlibs in this category!
            </p>
          }
        >
          <ul className="flex flex-col gap-4">
            {adlibs.map((adlib) => (
              <li key={adlib.id} className="p-0.5">
                <AdlibFeedCard adlib={adlib} />
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      </CardContent>
    </Card>
  );
}
