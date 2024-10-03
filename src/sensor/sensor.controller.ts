import { CreateSensorDto } from '@/sensor/dto/create-sensor.dto';
import { Sensor } from '@/sensor/entities/sensor.entity';
import { SensorService } from '@/sensor/sensor.service';
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post()
  async create(@Body() createSensorDto: CreateSensorDto): Promise<string> {
    await this.sensorService.handleSensorData(createSensorDto);
    return 'Dados do sensor recebidos e salvos!';
  }

  @Get()
  async findAll(): Promise<Sensor[]> {
    return this.sensorService.getAllSensorData();
  }
}
