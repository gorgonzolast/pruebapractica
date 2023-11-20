/* eslint-disable prettier/prettier */
import {IsDateString, IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class AirlineDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsDateString()
    readonly foundedOn: string;

    @IsUrl()
    readonly website: string;

}
