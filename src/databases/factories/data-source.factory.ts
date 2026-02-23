import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { DatabaseEnum } from 'src/shared/enum/database.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { DataSourceOptions, ObjectType } from 'typeorm';

export const entityDictionary: Record<DatabaseEnum, ObjectType<unknown>[]> = {
  [DatabaseEnum.POSTGRES]: [UserEntity],
};

export const createDataSourceOptions = (
  configService: ConfigService<Record<string | symbol, unknown>, false>,
  databaseName: string,
  entities: ObjectType<unknown>[],
): DataSourceOptions => {
  const upperDatabaseName = databaseName.toUpperCase();

  return {
    type: 'postgres',
    name: databaseName,
    host: configService.get<string>(
      `DB_${upperDatabaseName}_HOST`,
      'localhost',
    ),
    port: configService.get<number>(`DB_${upperDatabaseName}_PORT`, 5432),
    username: configService.get<string>(
      `DB_${upperDatabaseName}_USERNAME`,
      'default_user',
    ),
    password: configService.get<string>(
      `DB_${upperDatabaseName}_PASSWORD`,
      'default_password',
    ),
    database: configService.get<string>(
      `DB_${upperDatabaseName}_DATABASE`,
      'default_db',
    ),
    entities,
    migrations: [path.join(__dirname, '../postgres/migrations/*.{ts,js}')],
    migrationsRun: true,
    synchronize: false,
    ssl:
      configService.get<string>(`DB_${upperDatabaseName}_SSL`) === 'true'
        ? { rejectUnauthorized: false }
        : undefined,
  };
};
