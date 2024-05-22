import { AI } from "../ai/ai";
import { Bedrock } from "../ai/bedrock";
import { ChatGPT } from "../ai/chat_gpt";

export const handleAI = async (ai: AI, event) => {
  try {
    const bedrock = new Bedrock();

    return {
      statusCode: 200,
      body: await ai.prompt(event.queryStringParameters?.message),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify(e) };
  }
};

export const handleBedrock = async (event) => {
  return handleAI(new Bedrock(), event);
};

export const handleChatGPT = async (event) => {
  return handleAI(
    new ChatGPT({
      organization: process.env["OPENAI_ORG_ID"],
      apiKey: process.env["OPENAI_APY_KEY"],
    }),
    event,
  );
};
