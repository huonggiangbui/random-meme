import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meme } from '../meme/meme.entity';
import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Meme])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule { }
