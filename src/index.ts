import { readFileAsync, saveImages } from "./io/io.js";
import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const generate = async (prompt: string, howMany = 1) => {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: howMany,
    size: "1024x1024",
    style: "natural",
    response_format: "b64_json",
  });

  return response.data.map((image) => image.b64_json);
};

(async () => {
  const promptIntro = await readFileAsync("src/prompts/prompt-intro.txt");
  const data = await generate(
    `${promptIntro}\n
    create image of dairy products on white background`,
  );

  await saveImages(data, "png");
})();
