import { Test, TestingModule } from '@nestjs/testing';
import { RecordVoiceService } from './record-voice.service';

describe('RecordVoiceService', () => {
  let service: RecordVoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordVoiceService],
    }).compile();

    service = module.get<RecordVoiceService>(RecordVoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
