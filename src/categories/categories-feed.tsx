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
import CategoriesFeedCard from "./categories-feed-card";
import type { RouterOutputs } from "@/trpc/react";

const PAGE_SIZE = 25;

export default function CategoriesFeed() {
  const [timestamp] = React.useState(() => new Date());
  const [page, setPage] = React.useState(1);
  const [categories, setCategories] = React.useState<
    RouterOutputs["adlib"]["getCategories"]["data"]
  >([]);
  const [hasMore, setHasMore] = React.useState(true);

  const { data } = api.adlib.getCategories.useQuery({
    page,
    size: PAGE_SIZE,
    timestamp,
  });

  React.useEffect(() => {
    if (!data) return;
    if (page === 1) {
      setCategories(data.data);
    } else {
      setCategories((prev) => [...prev, ...data.data]);
    }
    if (data.data.length < PAGE_SIZE) {
      setHasMore(false);
    }
  }, [data, page]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>Browse adlibs by category</CardDescription>
      </CardHeader>
      <CardContent>
        <InfiniteScroll
          dataLength={categories.length}
          next={() => setPage((p) => p + 1)}
          hasMore={hasMore}
          loader={
            <p className="text-muted-foreground py-4 text-center text-sm">
              Loading...
            </p>
          }
          endMessage={
            <p className="text-muted-foreground py-4 text-center text-sm">
              You&apos;ve seen all the categories!
            </p>
          }
        >
          <ul className="flex flex-col gap-4">
            {categories.map((category) => (
              <li key={category.id} className="p-0.5">
                <CategoriesFeedCard category={category} />
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      </CardContent>
    </Card>
  );
}
