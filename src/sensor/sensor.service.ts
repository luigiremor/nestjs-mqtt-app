import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { Sensor } from '@/sensor/entities/sensor.entity';
import { SensorGateway } from '@/sensor/sensor.gateway';

@Injectable()
export class SensorService {
  private readonly logger = new Logger(SensorService.name);

  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
    @Inject(forwardRef(() => SensorGateway))
    private readonly sensorGateway: SensorGateway,
  ) {}

  async handleSensorData(data: CreateSensorDto): Promise<void> {
    const sensorData = this.sensorRepository.create(data);
    await this.sensorRepository.save(sensorData);
    this.logger.log(`Dados do sensor salvos: ${JSON.stringify(sensorData)}`);

    this.sensorGateway.broadcastSensorData(sensorData);
  }

  async getAllSensorData(): Promise<Sensor[]> {
    return this.sensorRepository.find({ order: { timestamp: 'DESC' } });
  }

  @OnEvent('sensor.data')
  async handleSensorDataEvent(payload: { topic: string; message: string }) {
    const { message } = payload;

    this.logger.log('Mensagem recebida:', message);

    try {
      const parsed = JSON.parse(message);
      const sensorData: CreateSensorDto = {
        temperature: parsed.temperature,
        humidity: parsed.humidity,
      };
      await this.handleSensorData(sensorData);
    } catch (error) {
      this.logger.error('Erro ao parsear dados do sensor:', error);
    }
  }

  async getLastSensorData(limit: number): Promise<Sensor[]> {
    const sanitizedLimit = Math.max(1, limit);
    return await this.sensorRepository.find({
      order: { timestamp: 'DESC' },
      take: sanitizedLimit,
    });
  }
}
