import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompanies1769466130573 implements MigrationInterface {
    name = 'CreateCompanies1769466130573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "public_phone" character varying, "image_name" character varying, "is_active" boolean NOT NULL DEFAULT true, "is_client" boolean NOT NULL DEFAULT false, "max_users" integer NOT NULL, "max_clients" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "provider_company_id" uuid, CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_4363a1bd55a7db09538bc53f2b5" FOREIGN KEY ("provider_company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_4363a1bd55a7db09538bc53f2b5"`);
        await queryRunner.query(`DROP TABLE "companies"`);
    }

}
