import { env } from "@/env";
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const madlibResponseSchema = z.object({
  title: z.string().min(1).max(255),
  madlib: z.string().min(1),
  isPg: z.boolean(),
  categories: z.array(z.string().min(1)).min(1).max(5),
});

export type MadlibResponse = z.infer<typeof madlibResponseSchema>;

export type RequestOptions = {
  temperature?: number;
  top_p?: number;
  model: "gpt-4.1-mini";
};

export async function createMadlib(
  prompt: string,
  options: RequestOptions = { model: "gpt-4.1-mini" },
) {
  const response = await openai.responses.create({
    input: [
      {
        role: "system",
        content:
          "You write concise madlibs. Return valid JSON only with keys: title, madlib, isPg, categories. \nBlanks in the madlib must use the format __wordtype__ (e.g. __noun__, __adjective__, __verb__). \nDo not wrap the JSON in code fences. isPg property indicates if the madlib is suitable for all audiences, base that on the prompt and the madlib content. Do not wrap the JSON in code fences",
      },
      {
        role: "user",
        content: `Create a madlib from this prompt: ${prompt}`,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "madlib_response",
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            madlib: { type: "string" },
            isPg: { type: "boolean" },
            categories: {
              type: "array",
              items: { type: "string" },
              minItems: 1,
              maxItems: 5,
            },
          },
          required: ["title", "madlib", "isPg", "categories"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
    ...options,
  });

  const raw = response.output_text?.trim();
  if (!raw) {
    throw new Error("OpenAI returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("OpenAI response was not valid JSON.");
  }

  return madlibResponseSchema.parse(parsed);
}

type PgModerationResult = {
  isPg: boolean;
  blockedCategories: string[];
  flagged: boolean;
};

export async function moderateForPg(
  input: string | string[],
): Promise<PgModerationResult> {
  const moderation = await openai.moderations.create({
    model: "omni-moderation-latest",
    input,
  });

  const result = moderation.results[0];
  if (!result) {
    throw new Error("OpenAI moderation returned no results.");
  }

  const categories = result.categories;

  const blocked: string[] = [];
  if (categories.sexual) blocked.push("sexual");
  if (categories["sexual/minors"]) blocked.push("sexual_minors");
  if (categories.violence) blocked.push("violence");
  if (categories["violence/graphic"]) blocked.push("violence_graphic");
  if (categories.hate) blocked.push("hate");
  if (categories["hate/threatening"]) blocked.push("hate_threatening");
  if (categories["harassment/threatening"])
    blocked.push("harassment_threatening");
  if (categories["self-harm"]) blocked.push("self_harm");
  if (categories["self-harm/instructions"])
    blocked.push("self_harm_instructions");
  if (categories.illicit) blocked.push("illicit");
  if (categories["illicit/violent"]) blocked.push("illicit_violent");

  return {
    isPg: blocked.length === 0,
    blockedCategories: blocked,
    flagged: result.flagged,
  };
}
