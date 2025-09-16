import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as fs from 'fs';
import Groq from 'groq-sdk/index.mjs';
import * as path from 'path';
import { Server, Socket } from 'socket.io';
import { Readable } from 'stream';
import { AiAgentService } from '../ai-agent/ai-agent.service';
import { AudioService } from './audio.service';

interface SessionData {
  buffers: Buffer[];
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AudioGateway {
  private groq: Groq;
  constructor(
    private readonly aiAgentService: AiAgentService,
    private readonly audioService: AudioService,
  ) {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  @WebSocketServer()
  server: Server;
  private sessions = new Map<string, SessionData>();

  handleConnection(client: Socket) {
    console.log(`🔗 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`client disconnect : ${client.id}`);
  }
  @SubscribeMessage('start')
  handleStart(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.sessions.set(data.sessionId, { buffers: [] });
    console.log(`Start session ${data.sessionId}`);
  }

  // listen event audio-chunk
  @SubscribeMessage('audio-chunk')
  async handleAudioChunk(
    @MessageBody()
    data: { sessionId: string; seq: number; chunkBase64: string },

    @ConnectedSocket() client: Socket,
  ) {
    const session = this.sessions.get(data.sessionId);
    if (!session) return;
    const buffer = Buffer.from(data.chunkBase64, 'base64');
    session.buffers.push(buffer);
    console.log(
      `chunk ${data.seq} received for session ${data.sessionId} , size=${buffer.length}`,
    );
  }

  @SubscribeMessage('end')
  async handleEnd(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const session = this.sessions.get(data.sessionId);
    if (!session) return;
    // รวมไฟล์ เสียง
    const filePath = path.join(
      __dirname,
      '..',
      'upload',
      `${data.sessionId}.m4a`,
    );

    fs.writeFileSync(filePath, Buffer.concat(session.buffers));
    console.log(`saved session audio : ${filePath}`);

    try {
      const transcription = await this.groq.audio.translations.create({
        file: fs.createReadStream(filePath),
        model: 'whisper-large-v3',
      });

      const text = transcription.text;
      console.log('📝 Transcription:', text);

      // ส่งข้อความกลับ client (optional)
      client.emit('transcription', { sessionId: data.sessionId, text });

      //---------------------***------------------------

      // GPT
      const reply = await this.aiAgentService.chat(
        [
          { role: 'system', content: 'คุณคือครูสอนภาษาอังกฤษ...' },
          { role: 'user', content: text },
        ],
        'gpt-oss-20b',
      );
      client.emit('ai-reply', { sessionId: data.sessionId, reply });
      console.log('🤖 GPT Reply:', reply);

      //---------------------***------------------------
      // TTS
      const response = await this.groq.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        voice: 'alloy',
        input: reply,
      });

      const nodeStream = Readable.fromWeb(response.body as any);
      for await (const chunk of nodeStream) {
        const base64Chunk = Buffer.from(chunk).toString('base64');
        client.emit('tts-chunk', { chunkBase64: base64Chunk });
      }
      client.emit('tts-end', { sessionId: data.sessionId });
    } catch (error) {
      console.error('❌ Pipeline error:', error);
      client.emit('error', {
        sessionId: data.sessionId,
        error: 'Processing failed',
      });
    } finally {
      // cleanup
      this.sessions.delete(data.sessionId);
    }
  }
}
