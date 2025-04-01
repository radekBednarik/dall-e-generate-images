import { generate } from "./generators/images.js";
import { readFileAsync, saveImages } from "./io/io.js";

(async () => {
  const promptIntro = await readFileAsync("src/prompts/prompt-intro.txt");
  const data = await generate(
    `${promptIntro}\n
    image of dairy products on white background`,
  );

  await saveImages(data, "png");
})();
