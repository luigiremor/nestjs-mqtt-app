import { MqttService } from '@/mqtt/mqtt.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly mqttService: MqttService) {}

  @Get('publish')
  publishMessage(): string {
    const topic = 'test/topic';
    const message = 'Olá do NestJS!';
    this.mqttService.publish(topic, message);
    return 'Mensagem publicada!';
  }

  @Get('subscribe')
  subscribeTopic(): string {
    const topic = 'test/topic';
    this.mqttService.subscribe(topic);
    return 'Subscreveu no tópico!';
  }

  @Get('unsubscribe')
  unsubscribeTopic(): string {
    const topic = 'test/topic';
    this.mqttService.unsubscribe(topic);
    return 'Cancelou a subscrição no tópico!';
  }
}
