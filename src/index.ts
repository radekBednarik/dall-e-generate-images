import { generate } from "./generators/images.js";
import { readFileAsync, saveImages } from "./io/io.js";
import { input, select } from "@inquirer/prompts";
import terminalLink from "terminal-link";

(async () => {
  const promptIntro = await readFileAsync("src/prompts/prompt-intro.txt");

  const howMany = await input({
    message:
      "How many pictures do you want to generate? Provide 1 - 10. This will apply for all subsequent prompts.",
  });

  const howManyNumber = parseInt(howMany, 10);
  const isNumber = !isNaN(howManyNumber);

  if (!isNumber) {
    console.error("Invalid input. Please enter a valid number.");
    return;
  }

  if (howManyNumber < 1 || howManyNumber > 10) {
    console.error("Invalid input. Please enter a number between 1 and 10.");
    return;
  }

  const picsFormat = (await select({
    message:
      "Select the image format. This will apply for all subsequent prompts.",
    default: "png",
    choices: [
      {
        name: "webp",
        value: "webp",
        description: "WebP format, best used in web frontend applications.",
      },
      {
        name: "png",
        value: "png",
        description:
          "PNG format, versatile and generally recommended format for online pictures.",
      },
      {
        name: "jpeg",
        value: "jpeg",
        description:
          "JPEG format, best used for photographs and images with gradients.",
      },
    ],
  })) as "webp" | "png" | "jpeg";

  while (true) {
    try {
      const prompt = await input({
        message: "Enter a prompt (or 'exit' to quit):",
      });

      if (prompt.toLowerCase() === "exit") {
        console.log("Exiting...");
        break;
      }

      const data = await generate(
        `${promptIntro}\n${prompt}`,
        howManyNumber,
        picsFormat,
      );

      if (data) {
        const terminalLinkPaths = (await saveImages(data, picsFormat)).map(
          (link) => terminalLink(link, `file://${link}`),
        );

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
