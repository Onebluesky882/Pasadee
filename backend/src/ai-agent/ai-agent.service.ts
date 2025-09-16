import { Injectable } from '@nestjs/common';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions.mjs';
import { GroqService } from '../groq/groq.service';
@Injectable()
export class AiAgentService {
  constructor(private readonly groqService: GroqService) {}

  async chat(
    messages: ChatCompletionMessageParam[], // ส่ง array ของ user/assistant message
    model: string = 'meta-llama/llama-4-scout-17b-16e-instruct', // default model
  ): Promise<string> {
    const response = await this.groqService.client.chat.completions.create({
      model,
      messages,
    });
    return response.choices[0]?.message?.content || '';
  }
}
