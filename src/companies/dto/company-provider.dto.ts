import { ApiProperty } from '@nestjs/swagger';

export class ProviderCompanyDto {
  @ApiProperty({
    description: 'ID da empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ description: 'Nome da empresa', example: 'Empresa XYZ' })
  name: string;

  @ApiProperty({ description: 'Email da empresa', example: 'empresa@xyz.com' })
  email: string;

  @ApiProperty({
    description: 'Número de telefone público',
    example: '+5511987654321',
  })
  publicPhone: string;

  @ApiProperty({ description: 'Quantidade máxima de usuários', example: 100 })
  maxUsers: number;

  @ApiProperty({ description: 'Quantidade máxima de clientes', example: 100 })
  maxClients: number;

  @ApiProperty({ description: 'Imagem da empresa', example: 'empresa.jpg' })
  image: string;
}
