import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comment/comment.entity';
import { Meme } from '../meme/meme.entity';
import { User } from '../user/user.entity';
import { ReportController } from './report.controller';
import { Report } from './report.entity';
import { ReportService } from './report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report, User, Comment, Meme])],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule { }
