import { IsDateString, IsEmail, IsNotEmpty, IsOptional, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AccountDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class ProfileDto {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
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
  avatarUrl: string;
}

export class UpdatePatientDto {
  @ValidateNested()
  @Type(() => AccountDto)
  account: AccountDto;

  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;
}
