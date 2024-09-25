import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;
  private readonly logger = new Logger(MqttService.name);

  onModuleInit() {
    this.connect();
  }

  connect() {
    // Conecte-se ao broker MQTT (ajuste o URL conforme necessário)
    this.client = mqtt.connect('mqtt://localhost:1883');

    this.client.on('connect', () => {
      this.logger.log('Conectado ao broker MQTT');
      // Subscriba em tópicos se necessário
      // this.subscribe('seu/topico');
    });

    this.client.on('error', (error) => {
      this.logger.error(`Erro na conexão MQTT: ${error.message}`);
    });

    this.client.on('message', (topic, message) => {
      this.logger.log(
        `Mensagem recebida - Tópico: ${topic}, Mensagem: ${message.toString()}`,
      );
      // Processar a mensagem conforme necessário
    });
  }

  publish(topic: string, message: string) {
    this.client.publish(topic, message, {}, (error) => {
      if (error) {
        this.logger.error(
          `Erro ao publicar no tópico ${topic}: ${error.message}`,
        );
      } else {
        this.logger.log(`Mensagem publicada no tópico ${topic}`);
      }
    });
  }

  subscribe(topic: string) {
    this.client.subscribe(topic, (error) => {
      if (error) {
        this.logger.error(
          `Erro ao subscrever no tópico ${topic}: ${error.message}`,
        );
      } else {
        this.logger.log(`Subscreveu no tópico ${topic}`);
      }
    });
  }

  unsubscribe(topic: string) {
    this.client.unsubscribe(topic, (error) => {
      if (error) {
        this.logger.error(
          `Erro ao cancelar a subscrição no tópico ${topic}: ${error.message}`,
        );
      } else {
        this.logger.log(`Cancelou a subscrição no tópico ${topic}`);
      }
    });
  }
}
