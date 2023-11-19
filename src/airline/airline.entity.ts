/* eslint-disable prettier/prettier */

import { AirportEntity } from "src/airport/airport.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AirlineEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    foundedOn: Date;
    @Column()
    website: string;

    @ManyToMany(() => AirportEntity, airport => airport.airlines)
    airports: AirlineEntity[];
}
