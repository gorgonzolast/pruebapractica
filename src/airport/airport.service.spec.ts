/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirportEntity } from './airport.entity';
import { AirportService } from './airport.service';

import { faker } from '@faker-js/faker';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airportsList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airportsList = [];
    for(let i = 0; i < 5; i++){
        const airport: AirportEntity = await repository.save({
        name: faker.airline.airport().name, 
        airportCode: faker.airline.airport().iataCode, 
        country: faker.location.country(), 
        city: faker.location.city()})
        airportsList.push(airport);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airports', async () => {
    const airports: AirportEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(airportsList.length);
  });

  it('findOne should return a airport by id', async () => {
    const storedAirport: AirportEntity = airportsList[0];
    const airport: AirportEntity = await service.findOne(storedAirport.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedAirport.name)
    expect(airport.airportCode).toEqual(storedAirport.airportCode)
    expect(airport.country).toEqual(storedAirport.country)
    expect(airport.city).toEqual(storedAirport.city)
  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });

  it('create should return a new airport', async () => {
    const airport: AirportEntity = {
      id: "",
      name: faker.airline.airport().name, 
      airportCode: faker.airline.airport().iataCode, 
      country: faker.location.country(), 
      city: faker.location.city(),
      airlines: []
    }

    const newAirport: AirportEntity = await service.create(airport);
    expect(newAirport).not.toBeNull();

    const storedAirport: AirportEntity = await repository.findOne({where: {id: newAirport.id}})
    expect(storedAirport).not.toBeNull();
    expect(airport.name).toEqual(storedAirport.name)
    expect(airport.airportCode).toEqual(storedAirport.airportCode)
    expect(airport.country).toEqual(storedAirport.country)
    expect(airport.city).toEqual(storedAirport.city)
  });

  it('create should throw an exception for an aiport with an invalid aiport code', async () => {
    const airport: AirportEntity = {
      id: "",
      name: faker.airline.airport().name, 
      airportCode: "ERTE", 
      country: faker.location.country(), 
      city: faker.location.city(),
      airlines: []
    }
    await expect(() => service.create(airport)).rejects.toHaveProperty("message", "The airport's code should be of length 3")
  });

  it('update should modify a airport', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.name = "New name";
    airport.airportCode = "New";
  
    const updatedAirport: AirportEntity = await service.update(airport.id, airport);
    expect(updatedAirport).not.toBeNull();
  
    const storedAirport: AirportEntity = await repository.findOne({ where: { id: airport.id } })
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(airport.name)
    expect(storedAirport.airportCode).toEqual(airport.airportCode)
  });
 
  it('update should throw an exception for an invalid airport', async () => {
    let airport: AirportEntity = airportsList[0];
    airport = {
      ...airport, name: "New name", airportCode: "New"
    }
    await expect(() => service.update("0", airport)).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });

  it('update should throw an exception for an airport with an invalid aiport code', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.airportCode = "ERTE";
    await expect(() => service.update(airport.id, airport)).rejects.toHaveProperty("message", "The airport's code should be of length 3")
  });

  it('delete should remove a airport', async () => {
    const airport: AirportEntity = airportsList[0];
    await service.delete(airport.id);
  
    const deletedAirport: AirportEntity = await repository.findOne({ where: { id: airport.id } })
    expect(deletedAirport).toBeNull();
  });

  it('delete should throw an exception for an invalid airport', async () => {
    const airport: AirportEntity = airportsList[0];
    await service.delete(airport.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });
 
});