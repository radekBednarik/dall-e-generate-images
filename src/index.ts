import { generate } from "./generators/images.js";
import { readFileAsync, saveImages } from "./io/io.js";
import { input } from "@inquirer/prompts";

(async () => {
  const promptIntro = await readFileAsync("src/prompts/prompt-intro.txt");
  while (true) {
    const prompt = await input({
      message: "Enter a prompt (or 'exit' to quit):",
    });

    if (prompt.toLowerCase() === "exit") {
      console.log("Exiting...");
      break;
    }

    const data = await generate(`${promptIntro}\n${prompt}`);

    await saveImages(data, "png");
  }
})();
