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
import { AiAgentService } from '../aiAgent/aiAgent.service';
import { GroqService } from '../groq/groq.service';

interface SessionData {
  buffers: Buffer[];
  sampleRate: number;
  mimeType: string;
  interval?: ReturnType<typeof setInterval>;
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
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  // ▶️ Start session
  @SubscribeMessage('start')
  handleStart(
    @MessageBody()
    data: { sessionId: string; sampleRate: number; mimeType: string },
    @ConnectedSocket() client: Socket,
  ) {
    const session: SessionData = {
      buffers: [],
      sampleRate: data.sampleRate,
      mimeType: data.mimeType,
    };

    const uploadDir = path.join(process.cwd(), 'upload');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    client.join(data.sessionId);

    session.interval = setInterval(async () => {
      if (session.buffers.length === 0) return;

      const finalBuffer = Buffer.concat(session.buffers);

      try {
        const filePath = path.join(
          uploadDir,
          `${data.sessionId}-${Date.now()}.m4a`,
        );
        fs.writeFileSync(filePath, finalBuffer);

        // 1️⃣ Speech-to-Text
        const transcription =
          await this.groqService.client.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-large-v3-turbo',
          });

        const userText = transcription.text;
        client.emit('transcription', {
          sessionId: data.sessionId,
          text: userText,
        });

        // 2️⃣ AI Chat
        const aiResponse = await this.aiAgentService.askTeacher(
          data.sessionId,
          userText,
        );
        client.emit('teacher-response', {
          sessionId: data.sessionId,
          text: aiResponse,
        });

        // 3️⃣ Text-to-Speech
        const ttsBuffer = await this.aiAgentService.textToSpeech(aiResponse);
        client.emit('teacher-audio', {
          sessionId: data.sessionId,
          audioBase64: ttsBuffer.toString('base64'),
        });

        // cleanup
        fs.unlinkSync(filePath);
        session.buffers = [];
      } catch (err) {
        console.error('❌ Pipeline error:', err);
        client.emit('pipeline-error', {
          sessionId: data.sessionId,
          error: err.message,
        });
      }
    }, 5000);

    this.sessions.set(data.sessionId, session);
    console.log(`▶️ Session started: ${data.sessionId}`);
  }

  // 📥 รับ audio chunk
  @SubscribeMessage('audio-chunk')
  handleAudioChunk(
    @MessageBody()
    data: {
      sessionId: string;
      seq: number;
      chunkBase64: string;
    },
  ) {
    const session = this.sessions.get(data.sessionId);
    if (!session) return;

    const buffer = Buffer.from(data.chunkBase64, 'base64');
    session.buffers.push(buffer);
    console.log(
      `📥 Chunk received | sessionId=${data.sessionId} | seq=${data.seq}`,
    );
  }

  @SubscribeMessage('stop')
  handleStop(@MessageBody() data: { sessionId: string }) {
    const session = this.sessions.get(data.sessionId);
    if (!session) return;

    if (session.interval) clearInterval(session.interval);
    this.sessions.delete(data.sessionId);

    this.server
      .to(data.sessionId)
      .emit('stopped', { sessionId: data.sessionId });

    console.log(`🛑 Session stopped: ${data.sessionId}`);
  }
}
