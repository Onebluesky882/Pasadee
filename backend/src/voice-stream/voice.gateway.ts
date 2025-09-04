import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as fs from 'fs';
import { OpenAI } from 'openai/client.js';
import * as path from 'path';
import { Server } from 'socket.io';

@WebSocketGateway({ path: '/ws/voice' })
export class VoiceGateway {
  @WebSocketServer() server: Server;
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  @SubscribeMessage('audio-chunk')
  async handleAudioChunk(client: any, payload: Buffer) {
    // 1️⃣ ส่ง chunk ไป Whisper streaming API
    const tempPath = path.join(process.cwd(), `chunk-${Date.now()}.m4a`);
    fs.writeFileSync(tempPath, payload);

    // 2️⃣ Transcribe chunk
    const transcriptionChunk = await this.openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: 'whisper-1',
      prompt: 'English only',
    });
    fs.unlinkSync(tempPath);

    // 3️⃣ รับ  Stream chat response
    const chatStream = await this.openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        { role: 'system', content: 'You are Sara, chat casually in English' },
        { role: 'user', content: transcriptionChunk.text },
      ],
      stream: true,
    });

    let fullText = '';
    for await (const chunk of chatStream) {
      const delta = chunk.choices[0].delta.content;
      if (delta) {
        fullText += delta;
        // 4️⃣ ส่งข้อความกลับ client ทันที
        client.emit('chat-delta', delta);
      }
    }

    client.emit('chat-complete', fullText);
  }
}
