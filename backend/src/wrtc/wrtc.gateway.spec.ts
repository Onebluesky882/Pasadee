import { Test, TestingModule } from '@nestjs/testing';
import { WrtcGateway } from './wrtc.gateway';

describe('WrtcGateway', () => {
  let gateway: WrtcGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WrtcGateway],
    }).compile();

    gateway = module.get<WrtcGateway>(WrtcGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
