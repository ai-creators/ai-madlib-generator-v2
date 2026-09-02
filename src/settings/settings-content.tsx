"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ContentRatingToggle from "./content-rating-toggle";

export default function SettingsContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your preferences</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm font-medium">Content rating</p>
        <p className="text-muted-foreground text-sm">
          Choose whether to only see adlibs rated suitable for all audiences.
        </p>
        <ContentRatingToggle />
      </CardContent>
    </Card>
  );
}
