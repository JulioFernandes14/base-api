import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token de acesso JWT',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJlbWFpbCI6ImpvYW5vQGVtYWlsLmNvbSIsImlhdCI6MTY5MDAwMDAwMCwiZXhwIjoxNjkwMDAzNjAwfQ.xxxxx',
  })
  accessToken: string;

  user: UserDto;
}
