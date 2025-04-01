import "dotenv/config";
import { writeFile } from "fs/promises";
import OpenAI from "openai";
import { resolve, dirname } from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const generate = async (prompt: string, howMany = 1) => {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: howMany,
    size: "1024x1024",
    style: "vivid",
    response_format: "b64_json",
  });

  return response.data.map((image) => image.b64_json);
};

const fetchAndSave = async (data: (string | undefined)[]) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const storagePath = resolve(__dirname, "../downloaded_images/");

  data.forEach(async (d, i) => {
    if (d) {
      const base64String = d.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64String, "base64");
      const pngBuffer = await sharp(buffer).toFormat("png").toBuffer();

      await writeFile(`${storagePath}/image_${i}.png`, pngBuffer);
    }
  });
};

(async () => {
  const data = await generate(
    "create photorealistic image of dairy products on white background",
  );

  await fetchAndSave(data);
})();
