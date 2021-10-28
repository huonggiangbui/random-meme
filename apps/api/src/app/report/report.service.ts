import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  createQueryBuilder,
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { Meme } from '../meme/meme.entity';
import { User } from '../user/user.entity';
import { Report } from './report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Meme)
    private memeRepository: Repository<Meme>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private connection: Connection
  ) { }
  async create(user: User, content: string, object: string, id: string): Promise<void | Report> {
    const newReport = this.reportRepository.create({ content });
    await this.reportRepository.save(newReport);

    try {
      await this.connection
        .createQueryBuilder()
        .relation(Report, "owner")
        .of(newReport)
        .set(user);
      
      switch (object) {
        case 'user': {
          const userTarget = await this.userRepository.findOneOrFail(id);
          userTarget.reported.push(newReport);
          await this.userRepository.save(userTarget);
          break;
        }
        case 'meme': {
          const memeTarget = await this.memeRepository.findOneOrFail(id);
          (await memeTarget.reported).push(newReport);
          await this.memeRepository.save(memeTarget);
          break;
        }
        case 'comment': {
          const commentTarget = await this.commentRepository.findOneOrFail(id);
          commentTarget.reported.push(newReport);
          await this.commentRepository.save(commentTarget);
        }
      }

      return newReport;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async remove(user: User, id: string): Promise<void> {
    try {
      if (await this.validate(user, id)) {
        await this.reportRepository.delete(id);
      }
    } catch (err) {
      Logger.error(err);
      throw new Error('Cannot delete report with id: ' + id);
    }
  }

  async validate(user: User, id: string): Promise<boolean> {
    const report = await this.reportRepository.findOneOrFail(id);
    const owner = await report.owner
    return owner.email == user.email;
  }
}
