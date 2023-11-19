/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './airline/airline.module';
import { AirportModule } from './airport/airport.module';
import { AirportAirlineModule } from './airport-airline/airport-airline.module';
import { AirlineAirportModule } from './airline-airport/airline-airport.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from './airline/airline.entity';
import { AirportEntity } from './airport/airport.entity';

@Module({
  imports: [AirlineModule, AirportModule, AirportAirlineModule, AirlineAirportModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'aircompanies',
      entities: [AirlineEntity, AirportEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
