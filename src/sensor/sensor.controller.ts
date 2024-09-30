import { Controller, Get, Post, Body } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { CreateSensorDto } from './dto/create-sensor.dto';

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post()
  create(@Body() createSensorDataDto: CreateSensorDto) {
    this.sensorService.handleSensorData(createSensorDataDto);
    return 'Dados do sensor recebidos!';
  }

  @Get()
  findAll() {
    return this.sensorService.getAllSensorData();
  }
}
