import { Module } from '@nestjs/common';
import { GroqModule } from '../groq/groq.module';
import { AiAgentService } from './aiAgent.service';

@Module({
  imports: [GroqModule],
  providers: [AiAgentService],
  exports: [AiAgentService],
})
export class AiAgentModule {}
