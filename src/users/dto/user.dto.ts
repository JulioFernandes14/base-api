import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 'b3a6d6a4-8b9f-4f3e-9c3e-7d2a1a9f8b12',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João da Silva',
  })
  name: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'joao.silva@email.com',
  })
  email: string;
}
