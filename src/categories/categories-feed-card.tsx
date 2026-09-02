import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { routerConfig } from "@/router-config";
import type { RouterOutputs } from "@/trpc/react";
import Link from "next/link";

type Category = RouterOutputs["adlib"]["getCategories"]["data"][number];

export default function CategoriesFeedCard({
  category,
}: {
  category: Category;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{category.name}</CardTitle>
        <CardDescription>
          {category.adlibCount} adlib{category.adlibCount === 1 ? "" : "s"}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button size="lg" asChild>
          <Link
            href={routerConfig.categories.execute({ category: category.name })}
          >
            View Category
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
