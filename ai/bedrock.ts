import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

export class Bedrock implements AI {
  async prompt(desc: string): Promise<string> {
    const client = new BedrockRuntimeClient({
      region: "eu-central-1",
    });

    const req = {
      inputText: desc,
      textGenerationConfig: {
        maxTokenCount: 1024,
        stopSequences: [],
        temperature: 0,
        topP: 1,
      },
    };
    const input = {
      body: JSON.stringify(req),
      contentType: "application/json",
      accept: "application/json",
      modelId: "amazon.titan-text-express-v1",
    };

    const command = new InvokeModelCommand(input);
    const data = await client.send(command);
    let decoder = new TextDecoder();
    let text = decoder.decode(data.body);
    return text;
  }
}
