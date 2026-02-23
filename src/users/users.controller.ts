import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserEntity } from './entities/user.entity';

@ApiTags('Usuários')
@ApiBearerAuth()
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

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    description: 'Retorna os dados de um usuário pelo ID',
  })
  @ApiOkResponse({ type: UserDto })
  async findOne(@CurrentUser() user: UserEntity): Promise<UserDto | null> {
    const res = await this.usersService.findOne(user.id);

    if (!res) return null;

    return {
      id: res.id,
      name: res.name,
      email: res.email,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({
    description: 'Atualiza os dados de um usuário',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserDto })
  async update(
    @CurrentUser() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto | null> {
    return this.usersService.update(user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({
    description: 'Remove um usuário (soft delete)',
  })
  @ApiOkResponse({
    description: 'Usuário removido com sucesso',
  })
  async remove(@CurrentUser() user: UserEntity): Promise<void> {
    await this.usersService.remove(user.id);
  }
}
