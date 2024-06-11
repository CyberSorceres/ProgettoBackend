import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { prompts } from "../prompts";

export class Bedrock implements AI {
  async prompt(desc: string): Promise<string> {
    const client = new BedrockRuntimeClient({
      region: "us-east-1",
    });
    const promptId = event.queryStringParameters.promptId || 0;

    const prompt = `${prompts[promptId]}
Il prompt è: ${event.queryStringParameters.message}`;

    const req = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 100000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    };
    const input = {
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(req),
    };

    const command = new InvokeModelCommand(input);
    const data = await client.send(command);
    let decoder = new TextDecoder();
    let text = decoder.decode(data.body);
    return text;
  }
}
