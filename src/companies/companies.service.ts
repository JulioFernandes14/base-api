import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProviderCompanyDto } from './dto/create-provider-company.dto';
import { UpdateProviderCompanyDto } from './dto/update-provider-company.dto';
import { CompanyEntity } from './entities/company.entity';
import { DatabaseEnum } from 'src/shared/enum/database.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { ProviderCompanyDto } from './dto/company-provider.dto';
import { ClientCompanyDto } from './dto/company-client.dto';
import { CreateClientCompanyDto } from './dto/create-client-company.dto';
import { UpdateClientCompanyDto } from './dto/update-client-company.dto';

@Injectable()
export class CompaniesService {
  private readonly MAX_SIZE_MB = 25;
  private readonly MAX_SIZE_BYTES = this.MAX_SIZE_MB * 1024 * 1024;
  private readonly IMAGES_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];
  private readonly IMAGES_DIR = path.resolve(process.cwd(), 'images');

  constructor(
    @InjectRepository(CompanyEntity, DatabaseEnum.POSTGRES)
    private readonly companyEntity: Repository<CompanyEntity>,
  ) {
    if (!fs.existsSync(this.IMAGES_DIR)) {
      fs.mkdirSync(this.IMAGES_DIR, { recursive: true });
    }
  }

  private async emailConflict(
    email: string,
    isClient: boolean,
    providerId?: string,
  ): Promise<void> {
    const hasEmail = !providerId
      ? await this.companyEntity.findOne({
          where: {
            email,
            isClient,
          },
        })
      : await this.companyEntity.findOne({
          where: {
            email,
            isClient,
            providerCompany: {
              id: providerId,
            },
          },
        });

    if (hasEmail) {
      throw new BadRequestException('Email já cadastrado');
    }
  }

  private async publicPhoneConflict(publicPhone: string): Promise<void> {
    const hasPublicPhone = await this.companyEntity.findOne({
      where: {
        publicPhone,
      },
    });

    if (hasPublicPhone) {
      throw new BadRequestException('Telefone público já cadastrado');
    }
  }

  private saveImage(image: Express.Multer.File): string {
    if (image.size > this.MAX_SIZE_BYTES) {
      throw new BadRequestException(
        `O tamanho máximo da imagem é de ${this.MAX_SIZE_MB}MB`,
      );
    }

    const imageExtension = path.extname(image.originalname).toLowerCase();

    if (!this.IMAGES_EXTENSIONS.includes(imageExtension.slice(1))) {
      throw new BadRequestException(
        `A extensão da imagem deve ser ${this.IMAGES_EXTENSIONS.join(', ')}`,
      );
    }

    const fileName = `${randomUUID()}${imageExtension}`;

    const filePath = path.resolve(this.IMAGES_DIR, fileName);

    try {
      fs.writeFileSync(filePath, image.buffer);
    } catch (error) {
      throw new BadRequestException(
        `Erro ao salvar a imagem: ${(error as Error).message}`,
      );
    }

    return fileName;
  }

  async createProviderCompany(
    createCompanyDto: CreateProviderCompanyDto,
    image: Express.Multer.File,
  ): Promise<ProviderCompanyDto> {
    await this.emailConflict(createCompanyDto.email, false);
    await this.publicPhoneConflict(createCompanyDto.publicPhone);

    const fileName = this.saveImage(image);

    const company = this.companyEntity.create({
      ...createCompanyDto,
      imageName: fileName,
    });

    await this.companyEntity.save(company);

    return {
      id: company.id,
      name: company.name,
      email: company.email,
      publicPhone: company.publicPhone ?? '',
      maxUsers: company.maxUsers,
      maxClients: company.maxClients ?? 0,
      image: fileName,
    };
  }

  async createClientCompany(
    createCompanyDto: CreateClientCompanyDto,
    providerId: string,
  ): Promise<ClientCompanyDto> {
    await this.emailConflict(createCompanyDto.email, true, providerId);

    const providerCompany = await this.companyEntity.findOne({
      where: {
        id: providerId,
        isClient: false,
      },
    });

    if (!providerCompany) {
      throw new BadRequestException('Provedor não encontrado');
    }

    const companyCreate = {
      name: createCompanyDto.name,
      email: createCompanyDto.email,
      maxUsers: createCompanyDto.maxUsers,
      isClient: true,
      providerCompany,
    };

    const company = this.companyEntity.create(companyCreate);

    await this.companyEntity.save(company);

    return {
      id: company.id,
      name: company.name,
      email: company.email,
      maxUsers: company.maxUsers,
      providerId: company?.providerCompany?.id ?? '',
    };
  }

  async findAllProviderCompany(): Promise<ProviderCompanyDto[]> {
    const companies = await this.companyEntity.find({
      where: {
        isClient: false,
      },
    });

    return companies.map((company) => ({
      id: company.id,
      name: company.name,
      email: company.email,
      publicPhone: company.publicPhone ?? '',
      maxUsers: company.maxUsers,
      maxClients: company.maxClients ?? 0,
      image: company.imageName ?? '',
    }));
  }

  async findAllClientCompany(providerId: string): Promise<ClientCompanyDto[]> {
    const companies = await this.companyEntity.find({
      where: {
        isClient: true,
        providerCompany: {
          id: providerId,
        },
      },
    });

    return companies.map((company) => ({
      id: company.id,
      name: company.name,
      email: company.email,
      maxUsers: company.maxUsers,
      providerId: company?.providerCompany?.id ?? '',
    }));
  }

  async findOneProviderCompany(id: string): Promise<ProviderCompanyDto> {
    const company = await this.companyEntity.findOne({
      where: {
        id,
        isClient: false,
      },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    return {
      id: company.id,
      name: company.name,
      email: company.email,
      publicPhone: company.publicPhone ?? '',
      maxUsers: company.maxUsers,
      maxClients: company.maxClients ?? 0,
      image: company.imageName ?? '',
    };
  }

  async findOneClientCompany(
    id: string,
    providerId: string,
  ): Promise<ClientCompanyDto> {
    const company = await this.companyEntity.findOne({
      where: {
        id,
        isClient: true,
        providerCompany: {
          id: providerId,
        },
      },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    return {
      id: company.id,
      name: company.name,
      email: company.email,
      maxUsers: company.maxUsers,
      providerId: company?.providerCompany?.id ?? '',
    };
  }

  async updateProviderCompany(
    id: string,
    updateCompanyDto: UpdateProviderCompanyDto,
    image?: Express.Multer.File,
  ): Promise<ProviderCompanyDto> {
    const company = await this.companyEntity.findOne({
      where: {
        id,
        isClient: false,
      },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    if (updateCompanyDto.name) {
      company.name = updateCompanyDto.name;
    }

    if (updateCompanyDto.email && updateCompanyDto.email !== company.email) {
      await this.emailConflict(updateCompanyDto.email, false);
      company.email = updateCompanyDto.email;
    }

    if (
      updateCompanyDto.publicPhone &&
      updateCompanyDto.publicPhone !== company.publicPhone
    ) {
      await this.publicPhoneConflict(updateCompanyDto.publicPhone);
      company.publicPhone = updateCompanyDto.publicPhone;
    }

    if (image) {
      const fileName = this.saveImage(image);
      company.imageName = fileName;

      if (company.imageName) {
        const oldImagePath = path.resolve(this.IMAGES_DIR, company.imageName);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    if (updateCompanyDto.maxUsers) {
      company.maxUsers = updateCompanyDto.maxUsers;
    }

    if (updateCompanyDto.maxClients) {
      company.maxClients = updateCompanyDto.maxClients;
    }

    const companyUpdated = await this.companyEntity.save(company);

    return {
      id: companyUpdated.id,
      name: companyUpdated.name,
      email: companyUpdated.email,
      publicPhone: companyUpdated.publicPhone ?? '',
      maxUsers: companyUpdated.maxUsers,
      maxClients: companyUpdated.maxClients ?? 0,
      image: companyUpdated.imageName ?? '',
    };
  }

  async updateClientCompany(
    id: string,
    providerId: string,
    updateCompanyDto: UpdateClientCompanyDto,
  ): Promise<ClientCompanyDto> {
    const providerCompany = await this.companyEntity.findOne({
      where: {
        id: providerId,
        isClient: false,
      },
    });

    if (!providerCompany) {
      throw new BadRequestException('Empresa não encontrada');
    }

    const clientCompany = await this.companyEntity.findOne({
      where: {
        id,
        isClient: true,
        providerCompany: {
          id: providerId,
        },
      },
    });

    if (!clientCompany) {
      throw new BadRequestException('Empresa não encontrada');
    }

    if (updateCompanyDto.name) {
      clientCompany.name = updateCompanyDto.name;
    }

    if (
      updateCompanyDto.email &&
      updateCompanyDto.email !== clientCompany.email
    ) {
      await this.emailConflict(
        updateCompanyDto.email,
        true,
        providerCompany.id,
      );
      clientCompany.email = updateCompanyDto.email;
    }

    if (updateCompanyDto.maxUsers) {
      clientCompany.maxUsers = updateCompanyDto.maxUsers;
    }

    const companyUpdated = await this.companyEntity.save(clientCompany);

    return {
      id: companyUpdated.id,
      name: companyUpdated.name,
      email: companyUpdated.email,
      maxUsers: companyUpdated.maxUsers,
      providerId: companyUpdated?.providerCompany?.id ?? '',
    };
  }

  async removeProviderCompany(id: string): Promise<void> {
    const company = await this.companyEntity.findOne({
      where: {
        id,
        isClient: false,
      },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    if (company.imageName) {
      const oldImagePath = path.resolve(this.IMAGES_DIR, company.imageName);

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    await this.companyEntity.softDelete(id);
  }

  async removeClientCompany(id: string, providerId: string): Promise<void> {
    const providerCompany = await this.companyEntity.findOne({
      where: {
        id: providerId,
        isClient: true,
      },
    });

    if (!providerCompany) {
      throw new BadRequestException('Empresa não encontrada');
    }

    const clientCompany = await this.companyEntity.findOne({
      where: {
        id,
        isClient: true,
        providerCompany: {
          id: providerId,
        },
      },
    });

    if (!clientCompany) {
      throw new BadRequestException('Empresa não encontrada');
    }

    await this.companyEntity.softDelete(id);
  }
}
