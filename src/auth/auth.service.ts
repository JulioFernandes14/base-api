import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/company/entities/company.entity';
import { DatabaseEnum } from 'src/shared/enum/database.enum';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  CompanyLoginDto,
  CompanyLoginResponseDto,
} from './dto/company-login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateCompanyResponseDto } from 'src/company/dto/create-company.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CompanyEntity, DatabaseEnum.POSTGRES)
    private readonly companyEntity: Repository<CompanyEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async loginCompany(
    companyLoginDto: CompanyLoginDto,
  ): Promise<CompanyLoginResponseDto> {
    const company = await this.companyEntity.findOne({
      where: {
        email: companyLoginDto.email,
      },
    });

    if (!company) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const isPasswordValid = await bcrypt.compare(
      companyLoginDto.password,
      company.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = {
      id: company.id,
      isCompany: true,
      email: company.email,
    };

    const token = this.jwtService.sign(payload);
    const companyResponse: CreateCompanyResponseDto = {
      id: company.id,
      email: company.email,
      name: company.name,
      publicPhone: company.publicPhone,
      maxUsers: company.maxUsers,
    };

    return {
      token,
      company: companyResponse,
    };
  }
}
