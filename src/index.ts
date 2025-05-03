import { getModelOpts, getPrompt } from "./cli/prompts.js";
import { generate } from "./generators/images.js";
import { readFileAsync, saveImages } from "./io/io.js";
import prexit from "prexit";
import terminalLink from "terminal-link";

(async () => {
  prexit(() => {
    console.log("\nApplication terminated.");
  });

  const promptIntro = await readFileAsync("src/prompts/prompt-intro.txt");
  const modelOpts = await getModelOpts();

  while (true) {
    try {
      const prompt = await getPrompt();

      if (prompt === "exit") {
        console.log("Exiting...");
        break;
      }

      if (prompt.length === 0) {
        console.log("Prompt cannot be empty.");
        continue;
      }

      const data = await generate(
        `${promptIntro}\n${prompt}`,
        modelOpts.background,
        "gpt-image-1",
        modelOpts.moderation,
        modelOpts.n,
        modelOpts.output_compression,
        modelOpts.output_format,
        modelOpts.quality,
        modelOpts.size,
      );

      if (data) {
        const terminalLinkPaths = (
          await saveImages(
            prompt,
            data,
            modelOpts.storage_path,
            modelOpts.output_format,
          )
        ).map((link) => terminalLink(link, `file://${link}`));

        console.log(
          "Images saved successfully to:\n",
          terminalLinkPaths.join("\n"),
          "\n",
        );
      } else {
        console.error("Failed to generate images.");
      }
    } catch (error) {
      console.error("An error occurred:\n", error);
    }
  }
})();
