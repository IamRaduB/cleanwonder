import { IsDateString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @IsNotEmpty()
  ssn: string;

  @IsNotEmpty()
  addressLine1: string;

  @IsOptional()
  addressLine2: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  details: string;
}
