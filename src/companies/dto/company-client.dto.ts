import { ApiProperty } from '@nestjs/swagger';

export class ClientCompanyDto {
  @ApiProperty({
    description: 'ID da empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ description: 'Nome da empresa', example: 'Empresa XYZ' })
  name: string;

  @ApiProperty({ description: 'Email da empresa', example: 'empresa@xyz.com' })
  email: string;

  @ApiProperty({ description: 'Quantidade máxima de usuários', example: 100 })
  maxUsers: number;

  @ApiProperty({
    description: 'Id do provedor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  providerId: string;
}
