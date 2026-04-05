"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { useAdlibFeedStore } from "./adlib-feed-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdlibFeedSelect from "./adlib-feed-select";
import AdlibFeedCard from "./adlib-feed-card";

export default function AdlibFeed() {
  const {
    adlibs,
    pagination,
    feedOption,
    loadMore,
    appendAdlibs,
    resetAdlibs,
  } = useAdlibFeedStore();
  const [hasMore, setHasMore] = useState(true);

  const { data } = api.adlib.getFeed.useQuery({
    page: pagination.page,
    size: pagination.size,
    timestamp: pagination.timestamp,
    feedOption,
  });

  useEffect(() => {
    if (!data) return;
    if (pagination.page === 1) {
      resetAdlibs(data.data);
      setHasMore(true);
    } else {
      appendAdlibs(data.data);
    }
    if (data.data.length < pagination.size) {
      setHasMore(false);
    }
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{feedOption}...</CardTitle>
          <CardDescription>
            View the {feedOption.toLowerCase()} adlibs
          </CardDescription>
        </div>
        <AdlibFeedSelect />
      </CardHeader>
      <CardContent>
        <InfiniteScroll
          dataLength={adlibs.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <p className="text-muted-foreground py-4 text-center text-sm">
              Loading...
            </p>
          }
          endMessage={
            <p className="text-muted-foreground py-4 text-center text-sm">
              You&apos;ve seen all the adlibs!
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
