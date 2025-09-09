import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions.mjs';
@Injectable()
export class AiAgentService {
  private groq: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('No GROQ_API_KEY found in environment!');
      process.exit(1);
    }
    this.groq = new Groq({ apiKey });
  }

  // Dynamic chat method
  async chat(
    messages: ChatCompletionMessageParam[], // ส่ง array ของ user/assistant message
    model: string = 'meta-llama/llama-4-scout-17b-16e-instruct', // default model
  ): Promise<string> {
    const response = await this.groq.chat.completions.create({
      model,
      messages,
    });
    return response.choices[0]?.message?.content || '';
  }
}
