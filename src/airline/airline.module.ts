import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineService } from './airline.service';
import { AirlineEntity } from './airline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirlineEntity])],
  providers: [AirlineService]
})
export class AirlineModule {}
