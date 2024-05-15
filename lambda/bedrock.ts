import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

/**
 *
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 */

export const handler = async (event) => {
  try {
    const client = new BedrockRuntimeClient({
      region: "eu-central-1",
    });

    const req = {
      inputText: event.queryStringParameters?.message ?? "",
      textGenerationConfig: {
        maxTokenCount: 1024,
        stopSequences: [],
        temperature: 0,
        topP: 1,
      },
    };
    const input = {
      body: JSON.stringify(req),
      //JSON.stringify(request),
      contentType: "application/json",
      accept: "application/json",
      modelId: "amazon.titan-text-express-v1",
    };

    const command = new InvokeModelCommand(input);
    const data = await client.send(command);
    let decoder = new TextDecoder();
    let text = decoder.decode(data.body);

    return {
      statusCode: 200,
      body: text,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify(e) };
  }
};
