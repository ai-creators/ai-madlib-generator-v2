"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { routerConfig } from "@/router-config";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt must be at least 1 character.")
    .max(255, "Prompt must be at most 255 characters."),
});

export default function CreateAdlibForm() {
  const loadingToastId = React.useRef<string | number | undefined>(undefined);
  const router = useRouter();

  const createAdlib = api.adlib.create.useMutation({
    onMutate: () => {
      loadingToastId.current = toast.loading("Creating adlib...");
    },
    onSuccess: async (data) => {
      toast.dismiss(loadingToastId.current);
      toast.success("Adlib created successfully!");
      router.push(routerConfig.adlibPlay.execute({ id: data }));
    },
    onError: (error) => {
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Failed to create adlib");
    },
  });

  const form = useForm({
    defaultValues: {
      prompt: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await createAdlib.mutateAsync(value);
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
      className="flex flex-col gap-5"
    >
      {createAdlib.isError && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error Creating Madlib</AlertTitle>
          <AlertDescription>
            There was an error creating your madlib. Please try again.
          </AlertDescription>
        </Alert>
      )}
      <FieldGroup>
        <form.Field name="prompt">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Prompt</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Enter a prompt for your madlib"
                  autoComplete="off"
                  data-cy="prompt-input"
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
        disabled={createAdlib.isPending}
        data-cy="prompt-submit-btn"
      >
        Create Madlib
      </Button>
    </form>
  );
}
