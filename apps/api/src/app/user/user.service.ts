import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  createQueryBuilder,
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { User } from './user.entity';
import { v4 } from 'uuid';
import { Tokens } from '../types/Tokens';
import { CreateUserDto } from './dto/create-user';
import StorageService from '../storage/storage.service';

export interface IPayload {
  email: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly connection: Connection,
    private readonly jwtService: JwtService,
    private storageService: StorageService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  async create(data: CreateUserDto): Promise<Omit<User, "password" | "refresh_tokens">> {
    const newUser = this.userRepository.create(data);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    newUser.password = hashedPassword;
    const { password, refresh_tokens, ...rest } = await this.userRepository.save(newUser);

    return rest;
  }

  findAll(options?: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.find(options);
  }

  async getProfile(email: string): Promise<Omit<User, "password" | "refresh_tokens">>{
    const { password, refresh_tokens, ...rest } = await createQueryBuilder(User)
      .leftJoinAndSelect("User.memes", "Meme")
      .where("User.email = :email", { email: email })
      .getOne() as User;

    return rest;
  }

  async findByEmail(
    email: string,
    options?: FindOneOptions<User>
  ): Promise<User> {
    try {
      return this.userRepository.findOneOrFail(
        { email },
        options
      );
    } catch (err) {
      Logger.error(err);
      throw new Error('Cannot find user with email: ' + email);
    }
  }

  async update(user: User, data: Partial<
    Pick<User, "name" | "password">
  >, avatar: Express.Multer.File): Promise<UpdateResult | void>{
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }
    
    if (avatar) {
      if (user.avatar) {
        await this.deletePhoto(user)
      }
      await this.updatePhoto(user, avatar);
    }

    return this.userRepository.update(user.email, data);
  }

  async remove(user: User): Promise<void> {
    await this.deletePhoto(user);
    await this.userRepository.delete(user.email);
  }

  async updatePhoto(
    self: User,
    file: Express.Multer.File
  ): Promise<string> {
    file = await file;

    const nameParts = file.originalname.split(".");
    const extension = nameParts[nameParts.length - 1];
    const filename = v4() + "." + extension;

    file.filename = "profile-pictures/" + self.email + "/" + filename;

    const photoUrl = await this.storageService.uploadPublicFile(file);
    self.avatar = photoUrl;
    await this.userRepository.save(self);

    return photoUrl + "?dummy=1234";
  }

  async deletePhoto(user: User) {
    const avatarName = "profile-pictures/" + user.email + "/" + user.avatar.split("/").pop()
    await this.storageService.removeFile(avatarName)
  }

  async signinWithCredentials(
    email: string,
    password: string
  ): Promise<Tokens> {
    const user = await this.validate(email, password);
    const payload = await this.createPayload(user);

    return {
      access_token: await this.createAccessToken(payload),
      refresh_token: await this.createRefreshToken(user),
    };
  }

  async validate(email: string, pass: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }

    throw new UnauthorizedException();
  }

  async createPayload(user: User): Promise<IPayload> {
    return { email: user.email };
  }

  async createAccessToken(payload: IPayload): Promise<string> {
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  async createRefreshToken(user: User): Promise<string> {
    const token = v4();

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      user.refresh_tokens.push(token);
      await this.cacheManager.set('token:' + token, user, { ttl: 0 });
      await this.userRepository.save(user);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return token;
  }

  async refreshToken(refresh_token: string): Promise<string> {
    const data = await this.cacheManager.get<User>('token:' + refresh_token);
    if (!data) throw new UnauthorizedException();
    return this.createAccessToken(await this.createPayload(data));
  }

  async disableRefreshToken(token: string): Promise<boolean> {
    const data = await this.cacheManager.get<User>('token:' + token);
    if (!data?.email) throw new NotFoundException();

    const user = await this.findByEmail(data.email);
    if (!user.refresh_tokens.includes(token))
      throw new UnauthorizedException();

    const result = await this.cacheManager.del('token:' + token);
    return Boolean(result);
  }

  async disableAllRefreshTokens(user: User): Promise<number> {
    let count = 0;
    await Promise.all(
      user.refresh_tokens.map(async (token) => {
        count += await this.cacheManager.del('token:' + token);
      })
    );
    return count;
  }
}
