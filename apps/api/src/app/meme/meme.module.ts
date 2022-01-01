import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../storage/storage.module';
import { UserModule } from '../user/user.module';
import { MemeController } from './meme.controller';
import { Meme } from './meme.entity';
import { MemeService } from './meme.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meme]), StorageModule, UserModule],
  controllers: [MemeController],
  providers: [MemeService],
  exports: [MemeService],
})
export class MemeModule { }
