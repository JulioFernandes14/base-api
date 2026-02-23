import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseEnum } from 'src/shared/enum/database.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PayloadJwt } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity, DatabaseEnum.POSTGRES)
    private readonly userEntity: Repository<UserEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userEntity.findOne({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário ou senha inválido(s).');
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      throw new NotFoundException('Usuário ou senha inválido(s).');
    }

    const payload: PayloadJwt = { username: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
