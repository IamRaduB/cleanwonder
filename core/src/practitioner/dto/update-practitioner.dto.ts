import { IsOptional } from 'class-validator';

export class UpdatePractitionerDto {
  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  title?: string;

  @IsOptional()
  bio?: string;

  @IsOptional()
  avatarUrl?: string;
}
