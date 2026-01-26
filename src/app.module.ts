import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabasesModule } from './databases/databases.module';
import { ConfigModule } from '@nestjs/config';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    DatabasesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
