import { CreateClinicDto } from '../../clinic/dto/create-clinic.dto';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePractitionerDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  bio: string;

  @IsOptional()
  avatarUrl: string;

  @ValidateNested()
  @Type(() => CreateClinicDto)
  clinic: CreateClinicDto;
}
