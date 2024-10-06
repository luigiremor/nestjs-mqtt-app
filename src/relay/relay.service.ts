// src/relay/relay.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { MqttService } from '@/mqtt/mqtt.service';
import { UpdateRelayDto } from './dto/update-relay.dto';

@Injectable()
export class RelayService {
  private readonly logger = new Logger(RelayService.name);

  // Estado atual dos relés
  private relayStatus: UpdateRelayDto = {
    relay1: false,
    relay2: false,
    relay3: false,
    relay4: false,
  };

  constructor(private readonly mqttService: MqttService) {}

  /**
   * Atualiza os estados dos relés e publica a mensagem MQTT correspondente.
   * @param updateRelayDto - Objeto contendo os estados desejados para cada relé.
   */
  async updateRelays(updateRelayDto: UpdateRelayDto): Promise<void> {
    // Atualiza o estado interno
    this.relayStatus = updateRelayDto;

    // Cria a string de payload, por exemplo, '1010' para ligar relay1 e relay3
    const payload = `${updateRelayDto.relay1 ? '1' : '0'}${updateRelayDto.relay2 ? '1' : '0'}${updateRelayDto.relay3 ? '1' : '0'}${updateRelayDto.relay4 ? '1' : '0'}`;

    this.logger.log(
      `Publicando payload '${payload}' no tópico 'acionar/reles'`,
    );

    // Publica a mensagem no tópico MQTT
    await this.mqttService.publish('acionar/reles', payload);
  }

  /**
   * Retorna o estado atual dos relés.
   */
  getRelayStatus(): UpdateRelayDto {
    return this.relayStatus;
  }
}
