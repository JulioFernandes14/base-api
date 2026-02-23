import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseEnum } from 'src/shared/enum/database.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

export interface PayloadJwt {
  username: string;
  sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,

    @InjectRepository(UserEntity, DatabaseEnum.POSTGRES)
    private readonly userEntity: Repository<UserEntity>,
  ) {
    super({
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: PayloadJwt): Promise<UserEntity> {
    const user = await this.userEntity.findOne({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      throw new BadRequestException('Usuário inválido');
    }

    return user;
  }
}
