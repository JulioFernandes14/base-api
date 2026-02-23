import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'joao.silva@email.com',
    maxLength: 255,
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string;
}
