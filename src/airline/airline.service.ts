/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';

@Injectable()
export class AirlineService {
    constructor(
        @InjectRepository(AirlineEntity)
        private readonly airlineRepository: Repository<AirlineEntity>
    ){}

    async findAll(): Promise<AirlineEntity[]> {
        return await this.airlineRepository.find({ relations: ["airports"] });
    }

    async findOne(id: string): Promise<AirlineEntity> {
        const airline: AirlineEntity = await this.airlineRepository.findOne({where: {id}, relations: ["airports"] } );
        if (!airline)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
    
        return airline;
    }
    
    async create(airline: AirlineEntity): Promise<AirlineEntity> {
        const currentDate = new Date();
        const inputDate = new Date(airline.foundedOn);
        if (inputDate >= currentDate){
            throw new BusinessLogicException("The airline's foundation date should be past", BusinessError.PRECONDITION_FAILED)
        }    
        return await this.airlineRepository.save(airline);
    }

    async update(id: string, airline: AirlineEntity): Promise<AirlineEntity> {
        const currentDate = new Date();
        const inputDate = new Date(airline.foundedOn);
        if (inputDate >= currentDate){
            throw new BusinessLogicException("The airline's foundation date should be past", BusinessError.PRECONDITION_FAILED)
        }    
        const persistedAirline: AirlineEntity = await this.airlineRepository.findOne({where:{id}});
        if (!persistedAirline)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        
        airline.id = id; 
        
        return await this.airlineRepository.save(airline);
    }

    async delete(id: string) {
        const airline: AirlineEntity = await this.airlineRepository.findOne({where:{id}});
        if (!airline)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        
        await this.airlineRepository.remove(airline);
    }
}