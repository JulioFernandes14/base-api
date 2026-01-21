import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CompanyLoginDto,
  CompanyLoginResponseDto,
} from './dto/company-login.dto';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'rota responsável pelo login de empresa' })
  @ApiBody({ type: CompanyLoginDto })
  @ApiOkResponse({ type: CompanyLoginResponseDto })
  @Post('login/company')
  async loginCompany(
    @Body() companyLoginDto: CompanyLoginDto,
  ): Promise<CompanyLoginResponseDto> {
    return this.authService.loginCompany(companyLoginDto);
  }
}
