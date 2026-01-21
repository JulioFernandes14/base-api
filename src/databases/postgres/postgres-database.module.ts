import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  createDataSourceOptions,
  entityDictionary,
} from '../factories/data-source.factory';
import { DatabaseEnum } from 'src/shared/enum/database.enum';

const database = DatabaseEnum.POSTGRES;
const entities = entityDictionary[database];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createDataSourceOptions(configService, database, entities),
      name: database,
    }),
    TypeOrmModule.forFeature(entities, database),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class PostgresDatabaseModule {}
