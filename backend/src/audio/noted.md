```ts
// แบบที่ 1
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
    @MessageBody()
    data: { sessionId: string; sampleRate: number; mimeType: string },
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
    // รวม buffer เสียง
    const finalBuffer = Buffer.concat(session.buffers);

    // สร้างโฟลเดอร์ upload
    const uploadDir = path.join(__dirname, '..', 'upload');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    // เขียนไฟล์จริง
    const filePath = path.join(uploadDir, `${data.sessionId}.m4a`);
    fs.writeFileSync(filePath, finalBuffer);
    console.log(`💾 Saved session audio: ${filePath}`);
    try {
      const transcription =
        await this.groqService.client.audio.transcriptions.create({
          file: fs.createReadStream(filePath),
          model: 'whisper-large-v3',
        });
      console.log('📝 Transcription:', transcription.text);

      client.emit('transcription', {
        sessionId: data.sessionId,
        text: transcription.text,
      });
    } catch (error) {
      console.error('❌ Pipeline error:', error);
      client.emit('error', {
        sessionId: data.sessionId,
        error: 'Processing failed',
      });
    } finally {
      // cleanup
      this.sessions.delete(data.sessionId);
      console.log(`🧹 Session cleaned: ${data.sessionId}`);
    }
  }
}
```
