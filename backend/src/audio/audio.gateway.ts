import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as fs from 'fs';
import * as path from 'path';
import { Server, Socket } from 'socket.io';
import { AiAgentService } from '../ai-agent/ai-agent.service';
import { GroqService } from '../groq/groq.service';

interface SessionData {
  buffers: Buffer[];
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AudioGateway {
  constructor(
    private readonly aiAgentService: AiAgentService,
    private readonly groqService: GroqService,
  ) {}
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
    console.log(
      `▶️ Start session request: ${data.sessionId} from client ${client.id}`,
    );
    this.sessions.set(data.sessionId, { buffers: [] });
  }

  // listen event audio-chunk
  @SubscribeMessage('audio-chunk')
  async handleAudioChunk(
    @MessageBody()
    data: { sessionId: string; seq: number; chunkBase64: string },

    @ConnectedSocket() client: Socket,
  ) {
    const session = this.sessions.get(data.sessionId);
    if (!session) {
      console.warn(`⚠️ Received chunk for unknown session: ${data.sessionId}`);
      return;
    }
    const buffer = Buffer.from(data.chunkBase64, 'base64');
    session.buffers.push(buffer);
    console.log(
      `📥 Chunk received | sessionId=${data.sessionId} | seq=${data.seq} | size=${buffer.length} bytes`,
    );
  }

  @SubscribeMessage('end')
  async handleEnd(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const session = this.sessions.get(data.sessionId);
    if (!session) {
      console.warn(`⚠️ End called for unknown session: ${data.sessionId}`);
      return;
    }

    console.log(
      `🛑 End session: ${data.sessionId}, total chunks=${session.buffers.length}`,
    );
    // รวมไฟล์ เสียง
    const filePath = path.join(
      __dirname,
      '..',
      'upload',
      `${data.sessionId}.m4a`,
    );

    console.log(`💾 Saved session audio: ${filePath}`);

    try {
      const transcription =
        await this.groqService.client.audio.translations.create({
          file: fs.createReadStream(filePath),
          model: 'whisper-large-v3',
        });

      console.log('📝 Transcription:', transcription.text);

      // ส่งข้อความกลับ client (optional)
      // client.emit('transcription', { sessionId: data.sessionId, text });

      //---------------------***------------------------

      // GPT
      // const reply = await this.aiAgentService.chat(
      //   [
      //     { role: 'system', content: 'คุณคือครูสอนภาษาอังกฤษ...' },
      //     { role: 'user', content: text },
      //   ],
      //   'gpt-oss-20b',
      // );
      // client.emit('ai-reply', { sessionId: data.sessionId, reply });
      // console.log('🤖 GPT Reply:', reply);

      //---------------------***------------------------
      // TTS
      // const response = await this.groqService.client.audio.speech.create({
      //   model: 'gpt-4o-mini-tts',
      //   voice: 'alloy',
      //   input: reply,
      // });

      // const nodeStream = Readable.fromWeb(response.body as any);
      // for await (const chunk of nodeStream) {
      //   const base64Chunk = Buffer.from(chunk).toString('base64');
      //   client.emit('tts-chunk', { chunkBase64: base64Chunk });
      // }
      // client.emit('tts-end', { sessionId: data.sessionId });
    } catch (error) {
      console.error('❌ Pipeline error:', error);
      // client.emit('error', {
      //   sessionId: data.sessionId,
      //   error: 'Processing failed',
      // });
    } finally {
      // cleanup
      this.sessions.delete(data.sessionId);
      console.log(`🧹 Session cleaned: ${data.sessionId}`);
    }
  }
}
