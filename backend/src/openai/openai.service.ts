import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private readonly client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ Missing OPENAI_API_KEY in environment variables');
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // ✅ ต้องเป็น apiKey
    });
  }

  async postOpenAi(prompt: string) {
    try {
      const response = await this.client.responses.create({
        model: 'gpt-5-nano',
        instructions: 'You are a coding assistant that talks like a pirate',
        input: prompt,
      });
      return response;
    } catch (error) {
      console.error('postOpenAi error:', error);
      throw error; // ✅ ส่ง error กลับไปให้ controller
    }
  }
}
