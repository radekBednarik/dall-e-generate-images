import { mkdir, readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { v4 as uuidv4 } from "uuid";

export const readFileAsync = async (filePath: string) => {
  return await readFile(resolve(filePath), "utf-8");
};

export const saveImages = async (
  prompt: string,
  data: (string | undefined)[],
  storagePath: string,
  format: "png" | "jpeg" | "webp" = "png",
) => {
  const _storagePath = resolvePath(storagePath);

  await mkdir(storagePath, { recursive: true });

  const filepaths: string[] = [];

  const promises = data.map(async (d, i) => {
    if (d) {
      const base64String = d.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64String, "base64");
      // const imgBuffer = await sharp(buffer).toFormat(`${format}`).toBuffer();
      const filepath = `${_storagePath}/image_${prompt.replaceAll(" ", "_").substring(0, 10)}_${i}_${uuidv4()}.${format}`;

      await writeFile(filepath, buffer);

      filepaths.push(filepath);
    }
  });

  await Promise.all(promises);

  return filepaths;
};

function resolvePath(path: string) {
  return resolve(process.cwd(), path);
}
