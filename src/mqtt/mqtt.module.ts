import { MqttService } from '@/mqtt/mqtt.service';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
