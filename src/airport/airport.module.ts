import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportService } from './airport.service';
import { AirportEntity } from './airport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirportEntity])],
  providers: [AirportService]
})
export class AirportModule {}
