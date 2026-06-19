import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContactoDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nombreApellido: string;

  @IsEmail()
  @MaxLength(180)
  email: string;

  @IsString()
  @MaxLength(150)
  interes: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  mensaje?: string;
}
