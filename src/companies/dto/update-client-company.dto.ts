import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { TrimDto } from 'src/shared/decorators/trim-dto.decorator';

export class UpdateClientCompanyDto {
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
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Quantidade máxima de usuários',
    example: 100,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Quantidade máxima de usuários é obrigatória' })
  maxUsers?: number;
}
