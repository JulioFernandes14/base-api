import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsOptional } from 'class-validator';
import { TrimDto } from 'src/shared/decorators/trim-dto.decorator';

export class UpdateCompanyDto {
  @ApiPropertyOptional({
    description: 'Nome da empresa',
    example: 'Empresa XYZ',
  })
  @IsOptional({ message: 'Nome é obrigatório' })
  @TrimDto()
  name?: string;

  @ApiPropertyOptional({
    description: 'Email da empresa',
    example: 'empresa@xyz.com',
  })
  @TrimDto()
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Número de telefone público',
    example: '+5511987654321',
  })
  @TrimDto()
  @IsOptional()
  @IsPhoneNumber('BR', { message: 'Número de telefone público inválido' })
  publicPhone?: string;

  @ApiPropertyOptional({
    description: 'Quantidade máxima de usuários',
    example: 100,
  })
  @TrimDto()
  @IsOptional()
  maxUsers?: number;

  @ApiPropertyOptional({
    description: 'Quantidade máxima de clientes',
    example: 100,
  })
  @TrimDto()
  @IsOptional()
  maxClients?: number;
}

export class UpdateCompanySwaggerDto extends UpdateCompanyDto {
  @ApiPropertyOptional({
    description: 'Imagem da empresa',
    type: 'string',
    format: 'binary',
  })
  @TrimDto()
  @IsOptional()
  image?: Express.Multer.File;
}
