import { formatAdlibDate } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/react";

type Comment = RouterOutputs["comments"]["getByAdlibId"][number];

export default function AdlibCommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="border-b pb-3 last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {comment.authorName ?? "Anonymous"}
        </span>
        <span className="text-muted-foreground text-xs">
          {formatAdlibDate(comment.createdAt)}
        </span>
      </div>
      <p className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">
        {comment.body}
      </p>
    </div>
  );
}
