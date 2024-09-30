import { Module } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
import { MqttModule } from '@/mqtt/mqtt.module';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [MqttModule],
  controllers: [SensorController],
  providers: [SensorService],
})
export class SensorModule {
  constructor(
    private readonly sensorService: SensorService,
    private eventEmitter: EventEmitter2,
  ) {
    // Subscriba-se ao evento 'sensor.data'
    this.eventEmitter.on('sensor.data', (data) => {
      const { message } = data;
      // Supondo que a mensagem seja um JSON com temperatura e umidade
      try {
        const parsed = JSON.parse(message);
        const sensorData = {
          temperature: parsed.temperature,
          humidity: parsed.humidity,
          timestamp: new Date(),
        };
        this.sensorService.handleSensorData(sensorData);
      } catch (error) {
        console.error('Erro ao parsear dados do sensor:', error);
      }
    });
  }
}
