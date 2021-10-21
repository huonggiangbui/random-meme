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
} from 'typeorm';
import { Meme } from './meme.entity';
import { CreateMemeDto } from './dto/create-meme';
import { User } from '../user/user.entity';
import { getMemeFetcher, getRedditMemes } from './fetchmeme';
import admin from '../utils/admin';

export interface IPayload {
  email: string;
}

@Injectable()
export class MemeService {
  constructor(
    @InjectRepository(Meme)
    private memeRepository: Repository<Meme>,
    private connection: Connection
  ) { }
  async create(user: User, data: CreateMemeDto): Promise<Meme> {
    const newMeme = this.memeRepository.create(data);
    await this.memeRepository.save(newMeme);

    try {
      await this.connection
        .createQueryBuilder()
        .relation(Meme, "owner")
        .of(newMeme)
        .set(user);

      return newMeme;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async readMemeFetcher(memes: Meme[]) {
    for (let i = 0; i < memes.length; i++) {
      const meme = memes[i];
      const result = await this.findBySource(JSON.stringify(meme.source))
      if (!result) {
        await this.create(admin, meme)
      }
    }
  }

  async getAll(options?: FindManyOptions<Meme>): Promise<Meme[]> {
    try {
      const memeFetcher = await getMemeFetcher() as Meme[];
      const redditFetcher = await getRedditMemes() as Meme[];
      
      await this.readMemeFetcher(memeFetcher)
      await this.readMemeFetcher(redditFetcher)
      
      const memes = await createQueryBuilder(Meme)
        .leftJoinAndSelect("Meme.owner", "User")
        .select(['Meme', 'User.name', 'User.avatarUrl'])
        .getMany() as Meme[];

      return memes;
    } catch (err) {
      Logger.error(err);
      throw new Error('Cannot query memes');
    }
  }

  async findBySource(
    source: string,
    options?: FindOneOptions<Meme>
  ): Promise<Meme> {
    try {
      return this.memeRepository.findOne(
        { source },
        options
      );
    } catch (err) {
      Logger.error(err);
      throw new Error('Cannot find user with source: ' + source);
    }
  }

  async findById(
    id: string,
    options?: FindOneOptions<Meme>
  ): Promise<void | Meme> {
    try {
      const meme = await createQueryBuilder(Meme)
        .leftJoinAndSelect("Meme.owner", "User")
        .select(['Meme', 'User.name', 'User.avatarUrl'])
        .where("Meme.id = :id", { id: id })
        .getOneOrFail() as Meme;

      return meme;
    } catch (err) {
      Logger.error(err);
      throw new NotFoundException('Cannot find meme with id: ' + id);
    }
  }

  // async update(user: User, data: Partial<Pick<User, "name" | "avatarUrl" | "password">>): Promise<UpdateResult> {
  //   if (data.password) {
  //     const hashedPassword = await bcrypt.hash(data.password, 10);
  //     data.password = hashedPassword;
  //   }
  //   return this.userRepository.update(user.email, data);
  // }

  async remove(user: User, id: string): Promise<void> {
    try {
      const meme = await this.findById(id);
      if (meme && (await meme.owner).email == user.email) {
        await this.memeRepository.delete(id);
      }
    } catch (err) {
      Logger.error(err);
      throw new Error('Cannot delete meme with id: ' + id);
    }
  }

  // async validate(email: string, pass: string): Promise<User> {
  //   const user = await this.findByEmail(email);
  //   if (user && (await bcrypt.compare(pass, user.password))) {
  //     return user;
  //   }

  //   throw new UnauthorizedException();
  // }
}
