import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber } from 'class-validator';
import { TrimDto } from 'src/shared/decorators/trim-dto.decorator';

export class UpdateCompanyDto {
  @ApiPropertyOptional({
    description: 'Nome da empresa',
    example: 'Empresa XYZ',
  })
  @IsOptional()
  @TrimDto()
  name?: string;

  @ApiPropertyOptional({
    description: 'Email da empresa',
    example: 'empresa@xyz.com',
  })
  @IsOptional()
  @TrimDto()
  email?: string;

  @ApiPropertyOptional({
    description: 'Telefone público da empresa',
    example: '1234567890',
  })
  @IsOptional()
  @IsPhoneNumber('BR', { message: 'Telefone público inválido' })
  @TrimDto()
  publicPhone?: string;
}

export class UpdateCompanySwaggerDto extends UpdateCompanyDto {
  @ApiPropertyOptional({
    description: 'Imagem da empresa',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: Express.Multer.File;
}
