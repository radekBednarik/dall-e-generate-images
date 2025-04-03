import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, resolve } from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

export const readFileAsync = async (filePath: string) => {
  return await readFile(resolve(filePath), "utf-8");
};

export const saveImages = async (
  data: (string | undefined)[],
  format: "png" | "jpg",
) => {
  const storagePath = resolvePath("../../downloaded_images");

  await mkdir(storagePath, { recursive: true });

  data.forEach(async (d, i) => {
    if (d) {
      const base64String = d.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64String, "base64");
      const imgBuffer = await sharp(buffer).toFormat(`${format}`).toBuffer();

      await writeFile(
        `${storagePath}/image_${i}_${uuidv4()}.${format}`,
        imgBuffer,
      );
    }
  });
};

function resolvePath(path: string) {
  const filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(filename);

  return resolve(__dirname, path);
}
