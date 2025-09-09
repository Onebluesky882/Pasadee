import { Injectable } from '@nestjs/common';
import { AiAgentService } from '../ai-agent/ai-agent.service';

@Injectable()
export class VoiceStreamingService {
  constructor(private readonly aiAgentService: AiAgentService) {}
}
