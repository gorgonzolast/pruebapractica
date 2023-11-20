import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineAirportService } from './airline-airport.service';
import { AirlineEntity } from 'src/airline/airline.entity';
import { AirportEntity } from 'src/airport/airport.entity';
import { AirlineAirportController } from './airline-airport.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AirlineEntity, AirportEntity])],
  providers: [AirlineAirportService],
  controllers: [AirlineAirportController]
})
export class AirlineAirportModule {}
