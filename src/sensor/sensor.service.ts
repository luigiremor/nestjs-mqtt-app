import { CreateSensorDto } from '@/sensor/dto/create-sensor.dto';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class SensorService {
  private readonly logger = new Logger(SensorService.name);
  private sensorData: CreateSensorDto[] = [];

  handleSensorData(data: CreateSensorDto) {
    this.sensorData.push(data);
    this.logger.log(`Dados do sensor recebidos: ${JSON.stringify(data)}`);
    // Aqui você pode adicionar lógica para armazenar os dados em um banco de dados
  }

  getAllSensorData(): CreateSensorDto[] {
    return this.sensorData;
  }

  @OnEvent('sensor.data')
  handleSensorDataEvent(payload: { topic: string; message: string }) {
    const { message } = payload;
    // Supondo que a mensagem seja um JSON com temperatura e umidade
    try {
      const parsed = JSON.parse(message);
      const sensorData: CreateSensorDto = {
        temperature: parsed.temperature,
        humidity: parsed.humidity,
        timestamp: new Date(),
      };
      this.handleSensorData(sensorData);
    } catch (error) {
      this.logger.error('Erro ao parsear dados do sensor:', error);
    }
  }
}
