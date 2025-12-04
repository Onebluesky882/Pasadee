import { Injectable } from '@nestjs/common';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions.mjs';
import path from 'path';
import { GroqService } from '../groq/groq.service';

interface Conversation {
  sessionId: string;
  messages: ChatCompletionMessageParam[];
}

@Injectable()
export class AiAgentService {
  private conversations = new Map<string, Conversation>();
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

  async askTeacher(sessionId: string, userText: string): Promise<string> {
    let session = this.conversations.get(sessionId);
    if (!session) {
      session = { sessionId, messages: [] };
      this.conversations.set(sessionId, session);
    }

    // ใส่ข้อความ user ใหม่
    session.messages.push({ role: 'user', content: userText });

    // เพิ่ม system prompt แค่ครั้งแรก
    if (!session.messages.find((msg) => msg.role === 'system')) {
      session.messages.unshift({
        role: 'system',
        content:
          'You are a patient teacher. Explain concepts step by step in a simple way.',
      });
    }

    const response = await this.chat(session.messages);

    session.messages.push({ role: 'assistant', content: response });

    return response;
  }

  async textToSpeech(text: string) {
    const tempFilePath = path.join(
      __dirname,
      '..',
      'upload',
      `tts-${Date.now()}.m4a`,
    );

    try {
      const ttsResponse = await this.groqService.client.audio.speech.create({
        input: text,
        model: 'playai-tts', // ต้องระบุ model สำหรับ TTS
        voice: 'alloy',
        response_format: 'wav',
      });

      const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
      await fsPromises.writeFile(tempFilePath, audioBuffer);

      return audioBuffer;
    } catch (error) {
      console.error('❌ textToSpeech error:', error);
      return Buffer.from([]);
    } finally {
      if (fs.existsSync(tempFilePath)) await fsPromises.unlink(tempFilePath);
    }
  }
}
