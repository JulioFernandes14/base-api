import { Global, Module } from '@nestjs/common';
import { PostgresDatabaseModule } from './postgres/postgres-database.module';

@Global()
@Module({
  imports: [PostgresDatabaseModule],
  exports: [PostgresDatabaseModule],
})
export class DatabasesModule {}
