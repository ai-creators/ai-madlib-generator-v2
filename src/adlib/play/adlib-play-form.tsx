"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { routerConfig } from "@/router-config";
import { articleFor, parseAdlibBlanks } from "./parse-adlib";
import type { RouterOutputs } from "@/trpc/react";

type Adlib = RouterOutputs["adlib"]["getById"];

export default function AdlibPlayForm({ adlib }: { adlib: Adlib }) {
  const router = useRouter();
  const loadingToastId = React.useRef<string | number | undefined>(undefined);
  const blanks = React.useMemo(
    () => parseAdlibBlanks(adlib.text),
    [adlib.text],
  );

  const [answers, setAnswers] = React.useState<string[]>(() =>
    blanks.map(() => ""),
  );
  const [touched, setTouched] = React.useState<boolean[]>(() =>
    blanks.map(() => false),
  );

  const saveResult = api.adlib.saveResult.useMutation({
    onMutate: () => {
      loadingToastId.current = toast.loading("Generating your story...");
    },
    onSuccess: (resultId) => {
      toast.dismiss(loadingToastId.current);
      router.push(
        routerConfig.adlibPlayResult.execute({
          adlibId: adlib.id,
          resultId,
        }),
      );
    },
    onError: (error) => {
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Failed to save your story");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(blanks.map(() => true));

    if (answers.some((answer) => answer.trim().length === 0)) {
      toast.error("Please fill in every blank.");
      return;
    }

    saveResult.mutate({ adlibId: adlib.id, answers });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FieldGroup>
        {blanks.map((blank, index) => {
          const isInvalid =
            touched[index] && answers[index]?.trim().length === 0;
          return (
            <Field key={index} data-invalid={isInvalid}>
              <FieldLabel htmlFor={`blank-${index}`}>
                Enter {articleFor(blank)} {blank}
              </FieldLabel>
              <Input
                id={`blank-${index}`}
                value={answers[index] ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setAnswers((prev) =>
                    prev.map((a, i) => (i === index ? value : a)),
                  );
                }}
                onBlur={() =>
                  setTouched((prev) =>
                    prev.map((t, i) => (i === index ? true : t)),
                  )
                }
                aria-invalid={isInvalid}
                autoComplete="off"
                data-cy={`play-blank-input-${index}`}
              />
              {isInvalid && <FieldError errors={[{ message: "Required" }]} />}
            </Field>
          );
        })}
      </FieldGroup>
      <Button
        type="submit"
        className="w-fit"
        disabled={saveResult.isPending}
        data-cy="play-submit-btn"
      >
        Generate My Story
      </Button>
    </form>
  );
}
