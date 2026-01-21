import { ConfigService } from '@nestjs/config';
import {
  createDataSourceOptions,
  entityDictionary,
} from '../factories/data-source.factory';
import { DataSource } from 'typeorm';
import 'dotenv/config';
import { DatabaseEnum } from 'src/shared/enum/database.enum';

const configService = new ConfigService();

const database = DatabaseEnum.POSTGRES;
const entities = entityDictionary[database];

const dataSourceOptions = createDataSourceOptions(
  configService,
  database,
  entities,
);

export default new DataSource(dataSourceOptions);
