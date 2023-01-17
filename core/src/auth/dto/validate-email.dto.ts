import { IsNotEmpty } from 'class-validator';

export class ValidateEmailDto {
  @IsNotEmpty()
  token: string;
}
