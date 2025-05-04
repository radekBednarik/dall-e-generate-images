import { input, select } from "@inquirer/prompts";

const howMany = async () => {
  const howMany = await input({
    message: "How many pictures do you want to generate? Provide 1 - 10.",
    default: "1",
  });

  const howManyNumber = parseInt(howMany, 10);
  const isNumber = !isNaN(howManyNumber);

  if (!isNumber) {
    console.error("Invalid input. Please enter a valid number.");
    return null;
  }

  if (howManyNumber < 1 || howManyNumber > 10) {
    console.error("Invalid input. Please enter a number between 1 and 10.");
    return null;
  }

  return howManyNumber;
};

const picsFormat = async (background: "auto" | "transparent" | "opaque") => {
  const choices = [
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
  ];

  if (background !== "transparent") {
    choices.push({
      name: "jpeg",
      value: "jpeg",
      description:
        "JPEG format, best used for photographs and images with gradients.",
    });
  }
  return (await select({
    message: "Select the image format.",
    default: "png",
    choices,
  })) as "webp" | "png" | "jpeg";
};

const storagePath = async () => {
  return await input({
    message:
      "Enter the path to save the images. Provide either absolute path or relative to the current working directory:",
    default: "downloaded_images",
  });
};

const background = async () => {
  return await select({
    message: "Select a background transparency.",
    default: "auto",
    choices: [
      {
        name: "auto",
        value: "auto",
      },
      {
        name: "transparent",
        value: "transparent",
      },
      {
        name: "opaque",
        value: "opaque",
      },
    ],
  });
};

const moderation = async () => {
  return await select({
    message: "Select a moderation level.",
    default: "auto",
    choices: [
      {
        name: "auto",
        value: "auto",
        description: "Default moderation level.",
      },
      {
        name: "low",
        value: "low",
        description: "Low moderation level with less restrictive filtering.",
      },
    ],
  });
};

const compression = async (picsFormat: "webp" | "jpeg" | "png") => {
  if (["webp", "jpeg"].includes(picsFormat)) {
    const value = await input({
      message: "Enter the compression level (0-100).",
      default: "100",
    });

    const numberValue = parseInt(value, 10);
    const isNumber = !isNaN(numberValue);

    if (!isNumber) {
      console.error("Invalid input. Please enter a valid number.");
      return compression(picsFormat);
    }

    if (numberValue < 0 || numberValue > 100) {
      console.error(
        "Invalid input. Please enter a number between 0 and 100 inclusive.",
      );
      return compression(picsFormat);
    }

    return numberValue;
  }

  return null;
};

const quality = async () => {
  return (await select({
    message: "Select a image quality level.",
    default: "auto",
    choices: [
      {
        name: "auto",
        value: "auto",
        description:
          "Default quality level. Best quality will be automatically selected.",
      },
      {
        name: "low",
        value: "low",
      },
      {
        name: "medium",
        value: "medium",
      },
      {
        name: "high",
        value: "high",
      },
    ],
  })) as "auto" | "low" | "medium" | "high";
};

const size = async () => {
  return (await select({
    message: "Select a image size.",
    default: "auto",
    choices: [
      {
        name: "auto",
        value: "auto",
      },
      {
        name: "1024x1024",
        value: "1024x1024",
      },
      {
        name: "1536x1024",
        value: "1536x1024",
      },
      {
        name: "1024x1536",
        value: "1024x1536",
      },
    ],
  })) as "auto" | "1024x1024" | "1536x1024" | "1024x1536";
};

export async function getPrompt() {
  return await input({
    message: "Type in a gpt prompt (or 'exit' to quit):",
  });
}

export async function getModelOpts() {
  const howManyNumber = await howMany();

  const backgroundValue = (await background()) as
    | "auto"
    | "transparent"
    | "opaque";
  const picsFormatValue = await picsFormat(backgroundValue);
  const compressionValue = await compression(picsFormatValue);

  const qualityValue = (await quality()) as "auto" | "low" | "medium" | "high";
  const sizeValue = (await size()) as
    | "auto"
    | "1024x1024"
    | "1536x1024"
    | "1024x1536";
  const moderationValue = (await moderation()) as "auto" | "low";

  const storagePathValue = await storagePath();

  return {
    background: backgroundValue,
    moderation: moderationValue,
    n: howManyNumber,
    output_compression: compressionValue,
    output_format: picsFormatValue,
    quality: qualityValue,
    size: sizeValue,
    storage_path: storagePathValue,
  };
}
