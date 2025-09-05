import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AzureRealtimeService } from './voice-azure.service';

@WebSocketGateway({ namespace: 'voice' })
export class VoiceAzureGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private azureService: AzureRealtimeService) {}

  afterInit(server: Server) {
    console.log('VoiceAzureGateway initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('audio-chunk')
  async handleAudioChunk(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { base64: string },
  ) {
    console.log('Received audio chunk, size:', payload.base64.length);

    // ส่งต่อไป Azure Realtime
    this.azureService.sendAudioChunk(payload.base64);

    // รับข้อความ/เสียงจาก Azure และ emit กลับ client
    this.azureService.on('text', (text: string) => {
      client.emit('speech-text', text);
    });
    this.azureService.on('audio', (audioBuffer: Buffer) => {
      client.emit('speech-audio', audioBuffer.toString('base64'));
    });
  }
}
