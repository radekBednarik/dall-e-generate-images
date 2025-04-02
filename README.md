# simple CLI client for generating and storing DALL-E generated images

## Pre-conditions

- Node.js LTS
- git
- pnpm

## Installation

- clone repo <git@github.com>:radekBednarik/dall-e-generate-images.git
- run command in the root of the project:

```bash
pnpm install
```

- create `.env` file in the root of the project and add your own
  OpenAI API key:

```bash
API_KEY=your_openai_api_key
```

## Run

```bash
pnpm go
```

## Downloaded images

- these are stored in `./downloaded_images/` folder
