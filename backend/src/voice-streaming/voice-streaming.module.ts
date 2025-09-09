import { Module } from '@nestjs/common';
import { VoiceStreamingController } from './voice-streaming.controller';

@Module({
  controllers: [VoiceStreamingController],
})
export class VoiceStreamingModule {}
