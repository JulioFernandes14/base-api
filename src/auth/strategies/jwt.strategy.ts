import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from 'src/company/entities/company.entity';

type JwtPayload = {
  id: string;
  isCompany: boolean;
  exp?: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyEntity: Repository<CompanyEntity>,

    configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_ACCESS_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_ACCESS_SECRET não está configurado');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    } satisfies StrategyOptions);
  }

  async validate(payload: JwtPayload) {
    const hasExpiration =
      typeof payload.exp === 'number' && Number.isFinite(payload.exp);

    if (!hasExpiration) {
      throw new UnauthorizedException(
        'Token inválido: data de expiração ausente',
      );
    }

    if (payload.isCompany) {
      const company = await this.companyEntity.findOne({
        where: { id: payload.id },
      });

      if (!company) {
        throw new UnauthorizedException('Empresa não encontrada');
      }

      return company;
    }

    throw new UnauthorizedException('Token inválido');
  }
}
