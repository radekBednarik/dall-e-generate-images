import "dotenv/config";
import OpenAI from "openai";
import ora from "ora";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export const generate = async (prompt: string, howMany = 1) => {
  const spinner = ora("Generating images...").start();

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    n: howMany,
    size: "1024x1024",
    output_format: "png",
    quality: "high",
    moderation: "low",
  });

  spinner.stop();

  return response?.data?.map((image) => image.b64_json);
};
