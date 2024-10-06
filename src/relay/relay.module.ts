// src/relay/relay.module.ts

import { Module } from '@nestjs/common';
import { MqttModule } from '@/mqtt/mqtt.module';
import { RelayController } from '@/relay/relay.controller';
import { RelayService } from '@/relay/relay.service';

@Module({
  imports: [MqttModule],
  controllers: [RelayController],
  providers: [RelayService],
})
export class RelayModule {}
