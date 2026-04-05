import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatAdlibDate } from "@/lib/utils";
import { routerConfig } from "@/router-config";
import type { RouterOutputs } from "@/trpc/react";
import Link from "next/link";

export default function AdlibFeedCard({
  adlib,
}: {
  adlib: RouterOutputs["adlib"]["getFeed"]["data"][number];
}) {
  return (
    <Card>
      <CardHeader className="items-top flex justify-between">
        <div className="min-w-0 flex-1">
          <CardTitle>
            <Link
              className="underline-offset-2 hover:underline"
              href={routerConfig.adlib.execute({ id: adlib.id })}
            >
              {adlib.title}
            </Link>
          </CardTitle>
          <CardDescription className="truncate">
            {adlib.prompt}...
          </CardDescription>
        </div>
        <p className="text-muted-foreground shrink-0 text-sm whitespace-nowrap">
          {formatAdlibDate(adlib.createdAt)}
        </p>
      </CardHeader>
      {adlib.categories?.length > 0 ? (
        <CardContent>
          <ul className="flex flex-wrap gap-2">
            {adlib.categories.map((category) => (
              <li key={category} className="text-muted-foreground">
                <Link
                  href={routerConfig.categories.execute({ category })}
                  className="underline-offset-2 hover:underline"
                >
                  <span className="text-primary mr-1">#</span>
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      ) : null}
      <CardFooter className="gap-3">
        <Button size="lg" asChild>
          <Link href={routerConfig.adlib.execute({ id: adlib.id })}>
            View Adlib
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
