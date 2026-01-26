import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { TrimDto } from 'src/shared/decorators/trim-dto.decorator';

export class CreateProviderCompanyDto {
  @ApiProperty({ description: 'Nome da empresa', example: 'Empresa XYZ' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @TrimDto()
  name: string;

  @ApiProperty({ description: 'Email da empresa', example: 'empresa@xyz.com' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @TrimDto()
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    description: 'Número de telefone público',
    example: '+5511987654321',
  })
  @TrimDto()
  @IsPhoneNumber('BR', { message: 'Número de telefone público inválido' })
  @IsNotEmpty({ message: 'Número de telefone público é obrigatório' })
  publicPhone: string;

  @ApiProperty({ description: 'Quantidade máxima de usuários', example: 100 })
  @IsNotEmpty({ message: 'Quantidade máxima de usuários é obrigatória' })
  maxUsers: number;

  @ApiProperty({ description: 'Quantidade máxima de clientes', example: 100 })
  @TrimDto()
  @IsNotEmpty({ message: 'Quantidade máxima de clientes é obrigatória' })
  maxClients: number;
}

export class CreateProviderCompanySwaggerDto extends CreateProviderCompanyDto {
  @ApiProperty({
    description: 'Imagem da empresa',
    type: 'string',
    format: 'binary',
  })
  @TrimDto()
  image: Express.Multer.File;
}
