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
          "You write concise madlibs. Return valid JSON only with keys: title, madlib, isPg, categories. isPg property indicates if the madlib is suitable for all audiences, base that on the prompt and the madlib content. Do not wrap the JSON in code fences",
      },
      {
        role: "user",
        content: `Create a madlib from this prompt: ${prompt}`,
      },
    ],
    ...options,
  });

  console.log("RESPONSE: ", response.output_text.trim());

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
