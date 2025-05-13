import "dotenv/config";
import OpenAI from "openai";
import { type Uploadable } from "openai/uploads.mjs";
import ora from "ora";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export const generate = async (
  prompt: string,
  background: "transparent" | "opaque" | "auto",
  model: string = "gpt-image-1",
  moderation: "auto" | "low" | null,
  n: number | null,
  output_compression: number | null,
  output_format: "png" | "webp" | "jpeg",
  quality: "auto" | "low" | "medium" | "high",
  size: "auto" | "1024x1024" | "1536x1024" | "1024x1536",
) => {
  const spinner = ora("Generating images...").start();

  const response = await openai.images.generate({
    prompt,
    background,
    model,
    moderation,
    n,
    output_compression,
    output_format,
    quality,
    size,
  });

  spinner.stop();

  return response?.data?.map((image) => image.b64_json);
};

export const edit = async (
  image: Uploadable | Uploadable[],
  prompt: string,
  background: "transparent" | "opaque" | "auto" | null = "auto",
  mask: Uploadable | undefined,
  model: string = "gpt-image-1",
  n: number | null = 1,
  quality: "high" | "medium" | "low" | "auto" | null = "auto",
  size: "1024x1024" | "1536x1024" | "1024x1536" | "auto" = "auto",
) => {
  const spinner = ora("Editing image...").start();

  const response = await openai.images.edit({
    image,
    prompt,
    background,
    mask,
    model,
    n,
    quality,
    // @ts-expect-error broken types of openai api
    size,
  });

  spinner.stop();

  return response?.data?.map((image) => image.b64_json);
};
