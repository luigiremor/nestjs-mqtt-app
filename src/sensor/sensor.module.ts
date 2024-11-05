import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
import { Sensor } from './entities/sensor.entity';
import { MqttModule } from '@/mqtt/mqtt.module';
import { SensorGateway } from '@/sensor/sensor.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor]), MqttModule],
  controllers: [SensorController],
  providers: [SensorService, SensorGateway],
})
export class SensorModule {}
