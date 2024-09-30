import { CreateSensorDto } from '@/sensor/dto/create-sensor.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateSensorDto extends PartialType(CreateSensorDto) {}
