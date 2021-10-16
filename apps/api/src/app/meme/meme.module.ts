import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meme } from './meme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meme])],
  providers: [],
  exports: [],
})
export class MemeModule { }
