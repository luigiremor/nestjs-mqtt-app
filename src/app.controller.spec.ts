import { AppController } from '@/app.controller';
import { MqttService } from '@/mqtt/mqtt.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('AppController', () => {
  let appController: AppController;
  let mqttService: MqttService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: MqttService,
          useValue: {
            publish: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    mqttService = module.get<MqttService>(MqttService);
  });

  describe('publishMessage', () => {
    it('deve publicar uma mensagem e retornar a confirmação', () => {
      const result = appController.publishMessage();
      expect(mqttService.publish).toHaveBeenCalledWith(
        'test/topic',
        'Olá do NestJS!',
      );
      expect(result).toBe('Mensagem publicada!');
    });
  });

  describe('subscribeTopic', () => {
    it('deve subscrever no tópico e retornar a confirmação', () => {
      const result = appController.subscribeTopic();
      expect(mqttService.subscribe).toHaveBeenCalledWith('test/topic');
      expect(result).toBe('Subscreveu no tópico!');
    });
  });

  describe('unsubscribeTopic', () => {
    it('deve cancelar a subscrição no tópico e retornar a confirmação', () => {
      const result = appController.unsubscribeTopic();
      expect(mqttService.unsubscribe).toHaveBeenCalledWith('test/topic');
      expect(result).toBe('Cancelou a subscrição no tópico!');
    });
  });
});
