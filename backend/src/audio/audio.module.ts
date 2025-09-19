import { Module } from '@nestjs/common';
import { AiAgentModule } from '../aiAgent/aiAgent.module';
import { GroqModule } from '../groq/groq.module';
import { AudioGateway } from './audio.gateway';
import { AudioService } from './audio.service';

@Module({
  imports: [AiAgentModule, GroqModule],
  providers: [AudioService, AudioGateway],
})
export class AudioModule {}
