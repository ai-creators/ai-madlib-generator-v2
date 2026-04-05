import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAdlibDate(date: Date | string): string {
  const d = dayjs(date);
  const now = dayjs();
  const diffDays = now.diff(d, "day");
  const diffYears = now.diff(d, "year");

  if (diffDays < 1) {
    return `${d.format("MMM D")} (${d.fromNow()})`;
  } else if (diffYears < 1) {
    return d.format("MMM D");
  } else {
    return d.format("MMM D, YYYY");
  }
}
