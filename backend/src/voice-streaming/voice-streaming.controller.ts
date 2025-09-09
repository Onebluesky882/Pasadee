import { Body, Controller, Post } from '@nestjs/common';
import { AiAgentService } from '../ai-agent/ai-agent.service';
@Controller('voice-streaming')
export class VoiceStreamingController {
  private aiAgentService: AiAgentService;

  @Post('chat')
  async chat(@Body() body: { message: string; model?: string }) {
    const reply = await this.aiAgentService.chat;
  }
}
