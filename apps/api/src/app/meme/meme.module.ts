import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemeController } from './meme.controller';
import { Meme } from './meme.entity';
import { MemeService } from './meme.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meme])],
  controllers: [MemeController],
  providers: [MemeService],
  exports: [MemeService],
})
export class MemeModule { }
