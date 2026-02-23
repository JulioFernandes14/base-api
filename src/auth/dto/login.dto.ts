import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'joao.silva@email.com',
    maxLength: 255,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'Senha@123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
