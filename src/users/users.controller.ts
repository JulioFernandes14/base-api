import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    description: 'Cria um novo usuário',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ type: UserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({
    description: 'Retorna os dados de um usuário pelo ID',
  })
  @ApiOkResponse({ type: UserDto })
  async findOne(@Param('id') id: string): Promise<UserDto | null> {
    const user = await this.usersService.findOne(id);

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  @Put(':id')
  @ApiOperation({
    description: 'Atualiza os dados de um usuário',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto | null> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    description: 'Remove um usuário (soft delete)',
  })
  @ApiOkResponse({
    description: 'Usuário removido com sucesso',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
