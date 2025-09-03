import { Test, TestingModule } from '@nestjs/testing';
import { RecordVoiceController } from './record-voice.controller';

describe('RecordVoiceController', () => {
  let controller: RecordVoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordVoiceController],
    }).compile();

    controller = module.get<RecordVoiceController>(RecordVoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
