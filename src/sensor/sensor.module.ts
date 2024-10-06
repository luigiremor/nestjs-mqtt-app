import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
import { Sensor } from './entities/sensor.entity';
import { MqttModule } from '@/mqtt/mqtt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor]), MqttModule],
  controllers: [SensorController],
  providers: [SensorService],
})
export class SensorModule {}
