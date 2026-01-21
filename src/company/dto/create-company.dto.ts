// @Column()
//   name: string;

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

//   @Column()
//   email: string;

//   @Column()
//   password: string;

//   @Column()
//   publicPhone: string;

//   @Column({ name: 'path_image' })
//   pathImage: string;

//   @Column({ name: 'max_users', type: 'int' })
//   maxUsers: number;

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Empresa XYZ',
  })
  @IsNotEmpty({ message: 'Nome da empresa é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Email da empresa',
    example: 'empresa@xyz.com',
  })
  @IsNotEmpty({ message: 'Email da empresa é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Senha da empresa',
    example: '123456',
  })
  @IsNotEmpty({ message: 'Senha da empresa é obrigatória' })
  password: string;

  @ApiProperty({
    description: 'Telefone público da empresa',
    example: '1234567890',
  })
  @IsNotEmpty({ message: 'Telefone público da empresa é obrigatório' })
  @IsPhoneNumber('BR', { message: 'Telefone público inválido' })
  publicPhone: string;

  @ApiProperty({
    description: 'Número de usuários',
    example: 10,
  })
  @IsNotEmpty({ message: 'Número de usuários é obrigatório' })
  maxUsers: number;
}

export class CreateCompanySwaggerDto extends CreateCompanyDto {
  @ApiProperty({
    description: 'Imagem da empresa',
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;
}

export class CreateCompanyResponseDto {
  @ApiProperty({
    description: 'ID da empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Empresa XYZ',
  })
  name: string;

  @ApiProperty({
    description: 'Email da empresa',
    example: 'empresa@xyz.com',
  })
  email: string;

  @ApiProperty({
    description: 'Telefone público da empresa',
    example: '1234567890',
  })
  publicPhone: string;

  @ApiProperty({
    description: 'Número de usuários',
    example: 10,
  })
  maxUsers: number;
}
