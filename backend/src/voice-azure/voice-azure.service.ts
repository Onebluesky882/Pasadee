import { Injectable } from '@nestjs/common';

@Injectable()
export class VoiceAzureService {}

import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from '@azure/identity';
import EventEmitter from 'events';
import { AzureOpenAI } from 'openai/azure.js';

@Injectable()
export class AzureRealtimeService extends EventEmitter {
  private realtimeClient: any;

  constructor() {
    super();
    this.init();
  }

  async init() {
    const endpoint =
      process.env.AZURE_END_POINT || 'https://pasadee.openai.azure.com/';
    const deploymentName = 'pasadee'; // ใช้ deployment ของคุณ
    const apiVersion = '2025-08-28';

    const credential = new DefaultAzureCredential();
    const scope = 'https://cognitiveservices.azure.com/.default';
    const azureADTokenProvider = getBearerTokenProvider(credential, scope);

    const azureOpenAIClient = new AzureOpenAI({
      azureADTokenProvider,
      apiVersion,
      deployment: deploymentName,
      endpoint,
    });

    this.realtimeClient.on('response.output_text.delta', (event) => {
      this.emit('text', event.delta);
    });

    this.realtimeClient.on('response.output_audio.delta', (event) => {
      const buffer = Buffer.from(event.delta, 'base64');
      this.emit('audio', buffer);
    });

    this.realtimeClient.on('error', (err) => console.error(err));
    this.realtimeClient.socket.on('close', () =>
      console.log('Azure connection closed'),
    );
  }

  sendAudioChunk(base64: string) {
    if (!this.realtimeClient) return;
    const buffer = Buffer.from(base64, 'base64');
    if (this.realtimeClient.socket.readyState === 1) {
      this.realtimeClient.send({
        type: 'input_audio.buffer',
        audio: buffer.toString('base64'),
      });
    }
  }
}
