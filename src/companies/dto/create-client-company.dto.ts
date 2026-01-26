import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { TrimDto } from 'src/shared/decorators/trim-dto.decorator';

export class CreateClientCompanyDto {
  @ApiProperty({ description: 'Nome da empresa', example: 'Empresa XYZ' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @TrimDto()
  name: string;

  @ApiProperty({ description: 'Email da empresa', example: 'empresa@xyz.com' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @TrimDto()
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ description: 'Quantidade máxima de usuários', example: 100 })
  @IsNotEmpty({ message: 'Quantidade máxima de usuários é obrigatória' })
  maxUsers: number;
}
