// src/relay/relay.controller.ts

import { Controller, Post, Body, Get } from '@nestjs/common';
import { RelayService } from './relay.service';
import { UpdateRelayDto } from './dto/update-relay.dto';

@Controller('relay')
export class RelayController {
  constructor(private readonly relayService: RelayService) {}

  /**
   * Endpoint para atualizar os estados dos relés.
   * Exemplo de requisição:
   * POST /relay/update
   * {
   *   "relay1": true,
   *   "relay2": false,
   *   "relay3": true,
   *   "relay4": false
   * }
   */
  @Post('update')
  async updateRelays(@Body() updateRelayDto: UpdateRelayDto): Promise<string> {
    await this.relayService.updateRelays(updateRelayDto);
    return 'Estados dos relés atualizados com sucesso!';
  }

  /**
   * Endpoint para obter o estado atual dos relés.
   * Exemplo de requisição:
   * GET /relay/status
   */
  @Get('status')
  async getRelayStatus(): Promise<UpdateRelayDto> {
    return this.relayService.getRelayStatus();
  }
}
