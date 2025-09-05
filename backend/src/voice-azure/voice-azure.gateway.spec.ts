import { Test, TestingModule } from '@nestjs/testing';
import { VoiceAzureGateway } from './voice-azure.gateway';

describe('VoiceAzureGateway', () => {
  let gateway: VoiceAzureGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoiceAzureGateway],
    }).compile();

    gateway = module.get<VoiceAzureGateway>(VoiceAzureGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
