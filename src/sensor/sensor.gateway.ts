import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SensorService } from './sensor.service';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { Sensor } from '@/sensor/entities/sensor.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'sensors',
})
export class SensorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger('SensorGateway');

  constructor(
    @Inject(forwardRef(() => SensorService))
    private readonly sensorService: SensorService,
  ) {}

  afterInit() {
    this.logger.log('WebSocket Gateway Initialized');
    this.logger.log(
      'WebSocket server is running and ready to accept connections',
    );
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('requestSensorData')
  async handleRequestSensorData(client: Socket) {
    this.logger.log(`Received requestSensorData from client ${client.id}`);
    try {
      const data = await this.sensorService.getLastSensorData(15);
      this.logger.debug('Sending sensor data to client');
      client.emit('sensorData', data);
    } catch (error) {
      this.logger.error('Error handling sensor data request:', error);
      client.emit('error', { message: 'Failed to fetch sensor data' });
    }
  }

  @SubscribeMessage('requestCustomSensorData')
  async handleCustomSensorData(client: Socket, limit: number) {
    this.logger.log(
      `Received requestCustomSensorData from client ${client.id}`,
    );
    try {
      const data = await this.sensorService.getLastSensorData(limit);
      client.emit('customSensorData', data);
    } catch (error) {
      this.logger.error('Error handling custom sensor data request:', error);
      client.emit('error', { message: 'Failed to fetch custom sensor data' });
    }
  }

  broadcastSensorData(data: Sensor) {
    this.logger.log('Broadcasting new sensor data to all clients');
    this.server.emit('newSensorData', data);
  }
}
