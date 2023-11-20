/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirlineEntity } from './airline.entity';
import { AirlineService } from './airline.service';

import { faker } from '@faker-js/faker';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlinesList: AirlineEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airlinesList = [];
    for(let i = 0; i < 5; i++){
        const airline: AirlineEntity = await repository.save({
        name: faker.airline.airline().name, 
        description: faker.lorem.sentence(), 
        foundedOn: faker.date.past(),
        website: faker.image.url()})
        airlinesList.push(airline);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines', async () => {
    const airlines: AirlineEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlinesList.length);
  });

  it('findOne should return a airline by id', async () => {
    const storedAirline: AirlineEntity = airlinesList[0];
    const airline: AirlineEntity = await service.findOne(storedAirline.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedAirline.name)
    expect(airline.description).toEqual(storedAirline.description)
    expect(airline.foundedOn).toEqual(storedAirline.foundedOn)
    expect(airline.website).toEqual(storedAirline.website)
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

  it('create should return a new airline', async () => {
    const airline: AirlineEntity = {
      id: "",
      name: faker.airline.airline().name, 
      description: faker.lorem.sentence(), 
      foundedOn: faker.date.past(),
      website: faker.image.url(),
      airports: []
    }

    const newAirline: AirlineEntity = await service.create(airline);
    expect(newAirline).not.toBeNull();

    const storedAirline: AirlineEntity = await repository.findOne({where: {id: newAirline.id}})
    expect(storedAirline).not.toBeNull();
    expect(airline.name).toEqual(storedAirline.name)
    expect(airline.description).toEqual(storedAirline.description)
    expect(airline.foundedOn).toEqual(storedAirline.foundedOn)
    expect(airline.website).toEqual(storedAirline.website)
  });

  it('create should throw an exception for an airline with an invalid foundation date', async () => {
    const airline: AirlineEntity = {
      id: "",
      name: faker.airline.airline().name, 
      description: faker.lorem.sentence(), 
      foundedOn: faker.date.future(),
      website: faker.image.url(),
      airports: []
    }
    await expect(() => service.create(airline)).rejects.toHaveProperty("message", "The airline's foundation date should be past")
  });

  it('update should modify a airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    airline.name = "New name";
    airline.description = "New description";
  
    const updatedAirline: AirlineEntity = await service.update(airline.id, airline);
    expect(updatedAirline).not.toBeNull();
  
    const storedAirline: AirlineEntity = await repository.findOne({ where: { id: airline.id } })
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(airline.name)
    expect(storedAirline.description).toEqual(airline.description)
  });
 
  it('update should throw an exception for an invalid airline', async () => {
    let airline: AirlineEntity = airlinesList[0];
    airline = {
      ...airline, name: "New name", description: "New description"
    }
    await expect(() => service.update("0", airline)).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

  it('update should throw an exception for an airline with an invalid foundation date', async () => {
    const airline: AirlineEntity = airlinesList[0];
    airline.foundedOn = faker.date.future();
    await expect(() => service.update(airline.id, airline)).rejects.toHaveProperty("message", "The airline's foundation date should be past")
  });

  it('delete should remove a airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);
  
    const deletedAirline: AirlineEntity = await repository.findOne({ where: { id: airline.id } })
    expect(deletedAirline).toBeNull();
  });

  it('delete should throw an exception for an invalid airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });
 
});