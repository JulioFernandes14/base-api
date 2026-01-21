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
import { CompanyService } from './company.service';
import {
  CreateCompanyDto,
  CreateCompanyResponseDto,
  CreateCompanySwaggerDto,
} from './dto/create-company.dto';
import {
  UpdateCompanyDto,
  UpdateCompanySwaggerDto,
} from './dto/update-company.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Rota responsável por criar uma nova empresa' })
  @ApiBody({ type: CreateCompanySwaggerDto })
  @ApiOkResponse({ type: CreateCompanyResponseDto })
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.companyService.create(createCompanyDto, image);
  }

  @ApiOperation({ summary: 'Rota responsável por listar todas as empresas' })
  @ApiOkResponse({ type: CreateCompanyResponseDto, isArray: true })
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @ApiOperation({ summary: 'Rota responsável por buscar uma empresa por ID' })
  @ApiOkResponse({ type: CreateCompanyResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @ApiOperation({
    summary: 'Rota responsável por atualizar uma empresa por ID',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateCompanySwaggerDto })
  @ApiOkResponse({ type: CreateCompanyResponseDto })
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.companyService.update(id, updateCompanyDto, image);
  }

  @ApiOperation({ summary: 'Rota responsável por remover uma empresa por ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
