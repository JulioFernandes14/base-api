import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CompanyEntity } from 'src/company/entities/company.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest<TUser = CompanyEntity>(
    err: unknown,
    user: TUser,
  ): TUser {
    if (err || !user) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }

      throw new UnauthorizedException('Nenhum usuário foi encontrado');
    }
    return user;
  }
}
