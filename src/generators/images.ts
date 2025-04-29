import "dotenv/config";
import OpenAI from "openai";
import ora from "ora";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export const generate = async (
  prompt: string,
  howMany = 1,
  output_format: "png" | "webp" | "jpeg" = "png",
) => {
  const spinner = ora("Generating images...").start();

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    output_format,
    n: howMany,
    size: "1024x1024",
    quality: "high",
    moderation: "low",
  });

  spinner.stop();

  return response?.data?.map((image) => image.b64_json);
};
