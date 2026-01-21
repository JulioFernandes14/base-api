import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { DatabasesModule } from './databases/databases.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CompanyModule,
    DatabasesModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
