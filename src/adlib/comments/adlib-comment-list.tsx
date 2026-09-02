"use client";

import { api } from "@/trpc/react";
import AdlibCommentCard from "./adlib-comment-card";

export default function AdlibCommentList({ adlibId }: { adlibId: number }) {
  const {
    data: comments,
    isLoading,
    error,
  } = api.comments.getByAdlibId.useQuery({ adlibId });

  if (isLoading) {
    return (
      <p className="text-muted-foreground text-sm">Loading comments...</p>
    );
  }

  if (error) {
    return (
      <p className="text-destructive text-sm">
        Error loading comments: {error.message}
      </p>
    );
  }

  if (!comments || comments.length === 0) {
    return <p className="text-muted-foreground text-sm">No comments yet</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.map((comment) => (
        <AdlibCommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
