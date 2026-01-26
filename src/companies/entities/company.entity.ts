import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('companies')
export class CompanyEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ name: 'public_phone', nullable: true })
  publicPhone?: string;

  @Column({ name: 'image_name', nullable: true })
  imageName?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_client', default: false })
  isClient: boolean;

  @Column({ name: 'max_users' })
  maxUsers: number;

  @Column({ name: 'max_clients', nullable: true })
  maxClients?: number;

  @ManyToOne(() => CompanyEntity, (company) => company.companies, {
    nullable: true,
  })
  @JoinColumn({ name: 'provider_company_id' })
  providerCompany?: CompanyEntity;

  @OneToMany(() => CompanyEntity, (company) => company.providerCompany)
  companies: CompanyEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
