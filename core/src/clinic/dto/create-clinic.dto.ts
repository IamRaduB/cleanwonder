import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateClinicDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  logoUrl: string;

  @IsNotEmpty()
  vatId: string;

  @IsNotEmpty()
  addressLine1: string;

  @IsOptional()
  addressLine2: string;

  @IsOptional()
  description: string;
}
