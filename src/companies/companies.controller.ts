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
  UpdateProviderCompanyDto,
  UpdateProviderCompanySwaggerDto,
} from './dto/update-provider-company.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ProviderCompanyDto } from './dto/company-provider.dto';
import { ClientCompanyDto } from './dto/company-client.dto';
import { CreateClientCompanyDto } from './dto/create-client-company.dto';
import { UpdateClientCompanyDto } from './dto/update-client-company.dto';

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
    summary: 'Rota responsável por criar uma nova empresa cliente',
  })
  @ApiBody({ type: CreateClientCompanyDto })
  @ApiOkResponse({ type: ClientCompanyDto })
  @Post('client/:providerId')
  createClientCompany(
    @Param('providerId') providerId: string,
    @Body() createCompanyDto: CreateClientCompanyDto,
  ): Promise<ClientCompanyDto> {
    return this.companiesService.createClientCompany(
      createCompanyDto,
      providerId,
    );
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
    summary: 'Rota responsável por listar todas as empresas clientes',
  })
  @ApiOkResponse({ type: ClientCompanyDto, isArray: true })
  @Get('client/:providerId')
  findAllClientCompany(
    @Param('providerId') providerId: string,
  ): Promise<ClientCompanyDto[]> {
    return this.companiesService.findAllClientCompany(providerId);
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
    summary: 'Rota responsável por buscar uma empresa cliente por ID',
  })
  @ApiOkResponse({ type: ClientCompanyDto })
  @Get('client/:id/:providerId')
  findOneClientCompany(
    @Param('id') id: string,
    @Param('providerId') providerId: string,
  ): Promise<ClientCompanyDto> {
    return this.companiesService.findOneClientCompany(id, providerId);
  }

  @ApiOperation({
    summary: 'Rota responsável por atualizar uma empresa provedora por ID',
  })
  @ApiBody({ type: UpdateProviderCompanySwaggerDto })
  @ApiOkResponse({ type: ProviderCompanyDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Patch('provider/:id')
  updateProviderCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateProviderCompanyDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<ProviderCompanyDto> {
    return this.companiesService.updateProviderCompany(
      id,
      updateCompanyDto,
      image,
    );
  }

  @ApiOperation({
    summary: 'Rota responsável por atualizar uma empresa cliente por ID',
  })
  @ApiBody({ type: UpdateClientCompanyDto })
  @ApiOkResponse({ type: ClientCompanyDto })
  @Patch('client/:id/:providerId')
  updateClientCompany(
    @Param('id') id: string,
    @Param('providerId') providerId: string,
    @Body() updateCompanyDto: UpdateClientCompanyDto,
  ): Promise<ClientCompanyDto> {
    return this.companiesService.updateClientCompany(
      id,
      providerId,
      updateCompanyDto,
    );
  }

  @ApiOperation({
    summary: 'Rota responsável por remover uma empresa provedora por ID',
  })
  @Delete('provider/:id')
  removeProviderCompany(@Param('id') id: string) {
    return this.companiesService.removeProviderCompany(id);
  }

  @ApiOperation({
    summary: 'Rota responsável por remover uma empresa cliente por ID',
  })
  @Delete('client/:id/:providerId')
  removeClientCompany(
    @Param('id') id: string,
    @Param('providerId') providerId: string,
  ) {
    return this.companiesService.removeClientCompany(id, providerId);
  }
}
