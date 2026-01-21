import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateCompanyDto,
  CreateCompanyResponseDto,
} from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyEntity } from './entities/company.entity';
import { DatabaseEnum } from 'src/shared/enum/database.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { NUMBER_OF_ROUNDS } from 'src/shared/consts/number-of-rounds';

@Injectable()
export class CompanyService {
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

  private async emailConflict(email: string): Promise<void> {
    const hasEmail = await this.companyEntity.findOne({
      where: {
        email,
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

  async create(
    createCompanyDto: CreateCompanyDto,
    image: Express.Multer.File,
  ): Promise<CreateCompanyResponseDto> {
    await this.emailConflict(createCompanyDto.email);
    await this.publicPhoneConflict(createCompanyDto.publicPhone);

    const fileName = this.saveImage(image);

    const { password, ...companyData } = createCompanyDto;

    const passwordHash = await bcrypt.hash(password, NUMBER_OF_ROUNDS);

    const company = await this.companyEntity.save({
      ...companyData,
      password: passwordHash,
      pathImage: fileName,
    });

    return {
      id: company.id,
      ...companyData,
    };
  }

  async findAll(): Promise<CreateCompanyResponseDto[]> {
    return await this.companyEntity.find({
      select: {
        id: true,
        name: true,
        email: true,
        publicPhone: true,
        maxUsers: true,
        pathImage: true,
      },
    });
  }

  async findOne(id: string): Promise<CreateCompanyResponseDto> {
    const company = await this.companyEntity.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        publicPhone: true,
        maxUsers: true,
        pathImage: true,
      },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    image?: Express.Multer.File,
  ) {
    const company = await this.companyEntity.findOne({
      where: {
        id,
      },
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    if (updateCompanyDto.email && updateCompanyDto.email !== company.email) {
      await this.emailConflict(updateCompanyDto.email);
    }

    if (
      updateCompanyDto.publicPhone &&
      updateCompanyDto.publicPhone !== company.publicPhone
    ) {
      await this.publicPhoneConflict(updateCompanyDto.publicPhone);
    }

    const fieldsToUpdate: Partial<CompanyEntity> = {
      ...updateCompanyDto,
    };

    if (image) {
      const fileName = this.saveImage(image);
      fieldsToUpdate.pathImage = fileName;

      if (company.pathImage) {
        const oldImagePath = path.resolve(this.IMAGES_DIR, company.pathImage);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    await this.companyEntity.update(id, fieldsToUpdate);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.companyEntity.softDelete(id);
  }
}
