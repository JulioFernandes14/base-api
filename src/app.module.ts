import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabasesModule } from './databases/databases.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabasesModule, ConfigModule.forRoot({ isGlobal: true }), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
