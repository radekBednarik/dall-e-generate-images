import "dotenv/config";
import OpenAI from "openai";
import ora from "ora";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export const generate = async (prompt: string, howMany = 1) => {
  const spinner = ora("Generating images...").start();

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: howMany,
    size: "1024x1024",
    style: "natural",
    response_format: "b64_json",
  });

  spinner.stop();

  return response.data.map((image) => image.b64_json);
};
