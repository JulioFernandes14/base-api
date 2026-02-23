import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DatabaseEnum } from 'src/shared/enum/database.enum';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity, DatabaseEnum.POSTGRES)
    private readonly userEntity: Repository<UserEntity>,
  ) {}

  private async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userEntity.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const hasEmail = await this.findByEmail(createUserDto.email);

    if (hasEmail) {
      throw new ConflictException('Email já cadastrado.');
    }

    const passwordHashed = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userEntity.save({
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash: passwordHashed,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async findOne(id: string): Promise<UserEntity | null> {
    const user = await this.userEntity.findOne({
      where: {
        id,
      },
    });

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto | null> {
    const user = await this.findOne(id);

    if (!user) return null;

    if (updateUserDto.email) {
      const hasEmail = await this.findByEmail(updateUserDto.email);

      if (hasEmail) {
        throw new ConflictException('Email já cadastrado.');
      }

      user.email = updateUserDto.email;
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    const userUpdated = await this.userEntity.save(user);

    return {
      id: userUpdated.id,
      name: userUpdated.name,
      email: userUpdated.email,
    };
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);

    if (!user) return;

    await this.userEntity.softDelete(id);
  }
}
