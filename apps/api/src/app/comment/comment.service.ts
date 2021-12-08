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
import { Meme } from '../meme/meme.entity';
import { User } from '../user/user.entity';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Meme)
    private memeRepository: Repository<Meme>,
    private connection: Connection
  ) { }
  async create(user: User, content: string, id: string): Promise<Comment> {
    const newComment = this.commentRepository.create({content});
    await this.commentRepository.save(newComment);

    const meme = await this.memeRepository.findOneOrFail(id)

    try {
      await this.connection
        .createQueryBuilder()
        .relation(Comment, "owner")
        .of(newComment)
        .set(user);
      
      await this.connection
          .createQueryBuilder()
          .relation(Comment, "meme")
          .of(newComment)
          .set(meme)

      return newComment;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // async findAll(options?: FindManyOptions<Comment>): Promise<Comment[]> {
  //   return this.commentRepository.find(options);
  // }

  // async findById(
  //   id: string,
  //   options?: FindOneOptions<Meme>
  // ): Promise<void | Meme> {
  //   try {
  //     const meme = await createQueryBuilder(Meme)
  //       .leftJoinAndSelect("Meme.owner", "User")
  //       .select(['Meme', 'User.name', 'User.avatar'])
  //       .where("Meme.id = :id", { id: id })
  //       .getOneOrFail() as Meme;

  //     return meme;
  //   } catch (err) {
  //     Logger.error(err);
  //     throw new NotFoundException('Cannot find meme with id: ' + id);
  //   }
  // }

  async update(user: User, content: string, id: string): Promise<UpdateResult> {
    try {
      if (await this.validate(user, id)) {
        return this.commentRepository.update(id, { content });
      }
    } catch (err) {
      Logger.error(err);
      throw new Error('Cannot update comment with id: ' + id);
    }
  }

  async remove(user: User, id: string): Promise<void> {
    try {
      if (await this.validate(user, id)) {
        await this.commentRepository.delete(id);
      }
    } catch (err) {
      Logger.error(err);
      throw new Error('Cannot delete comment with id: ' + id);
    }
  }

  async validate(user: User, id: string): Promise<boolean> {
    const comment = await this.commentRepository.findOneOrFail(id);
    const owner = await comment.owner
    return owner.email == user.email;
  }
}
