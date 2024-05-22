import { AI } from "./ai";
import OpenAI from "openai";

export class ChatGPT implements AI {
  private openAI: OpenAI;
  constructor({
    organization,
    apiKey,
  }: {
    organization: string;
    apiKey: string;
  }) {
    this.openAI = new OpenAI({
      organization,
      apiKey,
    });
  }
  async prompt(desc: string): Promise<string> {
    return (
      await this.openAI.chat.completions.create({
        messages: [{ role: "system", content: desc }],
        model: "gpt-4",
      })
    ).choices[0].message.content;
  }
}
