import { MqttService } from '@/mqtt/mqtt.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('MqttService', () => {
  let service: MqttService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MqttService],
    }).compile();

    service = module.get<MqttService>(MqttService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
