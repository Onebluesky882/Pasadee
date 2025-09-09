import { Test, TestingModule } from '@nestjs/testing';
import { VoiceStreamingController } from './voice-streaming.controller';

describe('VoiceStreamingController', () => {
  let controller: VoiceStreamingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoiceStreamingController],
    }).compile();

    controller = module.get<VoiceStreamingController>(VoiceStreamingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
