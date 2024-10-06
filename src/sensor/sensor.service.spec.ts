import { SensorService } from '@/sensor/sensor.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('SensorService', () => {
  let service: SensorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensorService],
    }).compile();

    service = module.get<SensorService>(SensorService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve armazenar dados do sensor', () => {
    const data = {
      temperature: 25.5,
      humidity: 60,
      timestamp: new Date(),
    };
    service.handleSensorData(data);
    const allData = service.getAllSensorData();
    expect(allData).toContainEqual(data);
  });

  it('deve retornar todos os dados do sensor', () => {
    const data1 = {
      temperature: 22.3,
      humidity: 55,
      timestamp: new Date(),
    };
    const data2 = {
      temperature: 23.7,
      humidity: 58,
      timestamp: new Date(),
    };
    service.handleSensorData(data1);
    service.handleSensorData(data2);
    const allData = service.getAllSensorData();
    expect(allData).toHaveLength(2);
    expect(allData).toContainEqual(data1);
    expect(allData).toContainEqual(data2);
  });
});
