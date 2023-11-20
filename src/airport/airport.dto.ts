/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class AirportDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly airportCode: string;

    @IsString()
    @IsNotEmpty()
    readonly country: string;

    @IsString()
    @IsNotEmpty()
    readonly city: string;


}
