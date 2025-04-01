import { writeFile, readFile } from "fs/promises";
import { resolve, dirname } from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

export const readFileAsync = async (filePath: string) => {
  return await readFile(resolve(filePath), "utf-8");
};

export const saveImages = async (
  data: (string | undefined)[],
  format: "png" | "jpg",
) => {
  const storagePath = resolvePath("../../downloaded_images");

  data.forEach(async (d, i) => {
    if (d) {
      const base64String = d.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64String, "base64");
      const pngBuffer = await sharp(buffer).toFormat(`${format}`).toBuffer();

      await writeFile(`${storagePath}/image_${i}.${format}`, pngBuffer);
    }
  });
};

function resolvePath(path: string) {
  const filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(filename);

  return resolve(__dirname, path);
}
