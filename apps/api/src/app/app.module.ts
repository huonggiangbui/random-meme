import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { configuration } from './config/configuration';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';
import { MemeModule } from './meme/meme.module';
import { ReportModule } from './report/report.module';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.env',
    }),
    UserModule,
    CommentModule,
    MemeModule,
    ReportModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      ssl: process.env.DB_SSL === 'true' && { rejectUnauthorized: false },
    }),
  ],
  controllers: [UserController],
  providers: [AppService],
})
export class AppModule { }
