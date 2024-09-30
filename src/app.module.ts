import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { MqttModule } from '@/mqtt/mqtt.module';
import { Module } from '@nestjs/common';
import { SensorModule } from './sensor/sensor.module';

@Module({
  imports: [MqttModule, SensorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
