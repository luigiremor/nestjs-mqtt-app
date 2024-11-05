import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './mqtt/mqtt.module';
import { SensorModule } from './sensor/sensor.module';
import { Sensor } from './sensor/entities/sensor.entity';
import { RelayModule } from './relay/relay.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST') ?? 'localhost',
        port: parseInt(configService.get<string>('POSTGRES_PORT'), 10) ?? 5432,
        username: configService.get<string>('POSTGRES_USER') ?? 'nest_user',
        password:
          configService.get<string>('POSTGRES_PASSWORD') ?? 'nest_password',
        database: configService.get<string>('POSTGRES_DB') ?? 'nest_db',
        entities: [Sensor],
        synchronize: true, // CHANGE IF IT'S ON PRODUCTION
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Sensor]),
    MqttModule,
    SensorModule,
    RelayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
