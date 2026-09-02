"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

const formSchema = z.object({
  authorName: z.string().trim().max(50, "Name must be at most 50 characters."),
  body: z
    .string()
    .trim()
    .min(1, "Comment can't be empty.")
    .max(1000, "Comment must be at most 1000 characters."),
});

export default function AdlibCommentForm({ adlibId }: { adlibId: number }) {
  const utils = api.useUtils();

  const createComment = api.comments.create.useMutation({
    onSuccess: async () => {
      toast.success("Comment posted");
      await utils.comments.getByAdlibId.invalidate({ adlibId });
      form.reset();
    },
    onError: (error) => {
      toast.error("Error posting comment", {
        description: error.message,
      });
    },
  });

  const form = useForm({
    defaultValues: {
      authorName: "",
      body: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await createComment.mutateAsync({
        adlibId,
        body: value.body,
        authorName: value.authorName || undefined,
      });
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <form.Field name="authorName">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Name (optional)</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Anonymous"
                autoComplete="off"
              />
            </Field>
          )}
        </form.Field>
        <form.Field name="body">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Comment</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Share your thoughts..."
                  data-cy="comment-body-input"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
      <Button
        type="submit"
        className="w-fit"
        disabled={createComment.isPending}
        data-cy="comment-submit-btn"
      >
        Post Comment
      </Button>
    </form>
  );
}
