import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import {
  CreateProviderCompanyDto,
  CreateProviderCompanySwaggerDto,
} from './dto/create-provider-company.dto';
import {
  UpdateCompanyDto,
  UpdateCompanySwaggerDto,
} from './dto/update-company.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ProviderCompanyDto } from './dto/company-provider.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiOperation({
    summary: 'Rota responsável por criar uma nova empresa provedora',
  })
  @ApiBody({ type: CreateProviderCompanySwaggerDto })
  @ApiOkResponse({ type: ProviderCompanyDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post('provider')
  createProviderCompany(
    @Body() createCompanyDto: CreateProviderCompanyDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ProviderCompanyDto> {
    return this.companiesService.createProviderCompany(createCompanyDto, image);
  }

  @ApiOperation({
    summary: 'Rota responsável por listar todas as empresas provedoras',
  })
  @ApiOkResponse({ type: ProviderCompanyDto, isArray: true })
  @Get('provider')
  findAllProviderCompany(): Promise<ProviderCompanyDto[]> {
    return this.companiesService.findAllProviderCompany();
  }

  @ApiOperation({
    summary: 'Rota responsável por buscar uma empresa provedora por ID',
  })
  @ApiOkResponse({ type: ProviderCompanyDto })
  @Get('provider/:id')
  findOneProviderCompany(@Param('id') id: string): Promise<ProviderCompanyDto> {
    return this.companiesService.findOneProviderCompany(id);
  }

  @ApiOperation({
    summary: 'Rota responsável por atualizar uma empresa provedora por ID',
  })
  @ApiBody({ type: UpdateCompanySwaggerDto })
  @ApiOkResponse({ type: ProviderCompanyDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Patch('provider/:id')
  updateProviderCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<ProviderCompanyDto> {
    return this.companiesService.updateProviderCompany(
      id,
      updateCompanyDto,
      image,
    );
  }

  @ApiOperation({
    summary: 'Rota responsável por remover uma empresa provedora por ID',
  })
  @Delete('provider/:id')
  removeProviderCompany(@Param('id') id: string) {
    return this.companiesService.removeProviderCompany(id);
  }
}
