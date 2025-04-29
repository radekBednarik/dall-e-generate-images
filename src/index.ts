import { generate } from "./generators/images.js";
import { readFileAsync, saveImages } from "./io/io.js";
import { input } from "@inquirer/prompts";

(async () => {
  const promptIntro = await readFileAsync("src/prompts/prompt-intro.txt");
  while (true) {
    try {
      const prompt = await input({
        message: "Enter a prompt (or 'exit' to quit):",
      });

      if (prompt.toLowerCase() === "exit") {
        console.log("Exiting...");
        break;
      }

      const data = await generate(`${promptIntro}\n${prompt}`);

      if (data) {
        const filepaths = await saveImages(data, "png");

        console.log("Images saved successfully to:\n", filepaths.join("\n"));
      } else {
        console.error("Failed to generate images.");
      }
    } catch (error) {
      console.error("An error occurred:\n", error);
    }
  }
})();
