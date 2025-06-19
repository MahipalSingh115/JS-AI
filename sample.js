// sample.js

import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import fs from "fs";
import path from "path";

const token = process.env.GITHUB_TOKEN; // Reference to env variable
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";
const imagePath = path.resolve("contoso_layout_sketch.jpg");

export async function main() {
  if (!token) {
    console.error("GITHUB_TOKEN is not set. Please set it as an environment variable.");
    process.exit(1);
  }

  const client = ModelClient(endpoint, new AzureKeyCredential(token));
  const imageBytes = fs.readFileSync(imagePath);
  const base64Image = imageBytes.toString("base64");

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Write HTML and CSS code for a web page based on the following hand-drawn sketch."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      temperature: 1.0,
      top_p: 1.0,
      model: model
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  console.log(response.body.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
