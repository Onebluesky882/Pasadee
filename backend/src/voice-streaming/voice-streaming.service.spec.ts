import { Test, TestingModule } from '@nestjs/testing';
import { VoiceStreamingService } from './voice-streaming.service';

describe('VoiceStreamingService', () => {
  let service: VoiceStreamingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoiceStreamingService],
    }).compile();

    service = module.get<VoiceStreamingService>(VoiceStreamingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
