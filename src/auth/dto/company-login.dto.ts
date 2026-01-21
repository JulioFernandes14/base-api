import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateCompanyResponseDto } from 'src/company/dto/create-company.dto';

export class CompanyLoginDto {
  @ApiProperty({
    description: 'Email da empresa',
    example: 'empresa@example.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Senha da empresa',
    example: '123456',
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;
}

export class CompanyLoginResponseDto {
  @ApiProperty({
    description: 'Token de acesso',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  token: string;

  @ApiProperty({
    description: 'Dados da empresa',
    type: CreateCompanyResponseDto,
    example: {
      id: '1234567890',
      name: 'Empresa Exemplo',
      email: 'empresa@example.com',
      publicPhone: '1234567890',
      pathImage: 'imagePath',
      maxUsers: 100,
    },
  })
  company: CreateCompanyResponseDto;
}
