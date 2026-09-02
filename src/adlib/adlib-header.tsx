import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatAdlibDate } from "@/lib/utils";
import { routerConfig } from "@/router-config";
import type { RouterOutputs } from "@/trpc/react";
import Link from "next/link";
import AdlibSaveButton from "./adlib-save-button";
import AdlibReactions from "./reactions/adlib-reactions";

type Adlib = RouterOutputs["adlib"]["getById"];

export default function AdlibHeader({ adlib }: { adlib: Adlib }) {
  return (
    <Card>
      <CardHeader className="items-top flex justify-between">
        <div className="min-w-0 flex-1">
          <CardTitle>{adlib.title}</CardTitle>
          <CardDescription>{adlib.prompt}</CardDescription>
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
      <CardContent className="flex items-center gap-2">
        <Button size="lg" asChild>
          <Link href={routerConfig.adlibPlay.execute({ id: adlib.id })}>
            Play Adlib
          </Link>
        </Button>
        <AdlibSaveButton adlibId={adlib.id} />
      </CardContent>
      <CardContent>
        <AdlibReactions adlibId={adlib.id} />
      </CardContent>
    </Card>
  );
}
