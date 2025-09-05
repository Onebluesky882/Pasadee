import { Test, TestingModule } from '@nestjs/testing';
import { VoiceAzureService } from './voice-azure.service';

describe('VoiceAzureService', () => {
  let service: VoiceAzureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoiceAzureService],
    }).compile();

    service = module.get<VoiceAzureService>(VoiceAzureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
