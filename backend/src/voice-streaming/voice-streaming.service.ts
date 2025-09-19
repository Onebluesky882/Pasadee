import { Injectable } from '@nestjs/common';
import { AiAgentService } from '../aiAgent/aiAgent.service';

@Injectable()
export class VoiceStreamingService {
  constructor(private readonly aiAgentService: AiAgentService) {}
}
