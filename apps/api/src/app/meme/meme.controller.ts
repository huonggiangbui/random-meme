import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { TheUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { CreateMemeDto } from './dto/create-meme';
import { Meme } from './meme.entity';
import { MemeService } from './meme.service';

@Controller()
export class MemeController {
  constructor(private readonly memeService: MemeService) { }

  @Get("memes")
  async getAllMemes(): Promise<Meme[]> {
    return this.memeService.getAll();
  }
  
  @Get("memes/:id")
  async getMeme(@Param() params): Promise<void | Meme> {
    return this.memeService.findById(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("memes")
  async createMeme(@TheUser() user: User, @Body() body: CreateMemeDto): Promise<void | Meme> {
    return this.memeService.create(user, body)
  }

  @UseGuards(JwtAuthGuard)
  @Delete("memes/:id")
  async deleteMeme(@TheUser() user: User, @Param() params): Promise<void> {
    return this.memeService.remove(user, params.id)
  }

  // @UseGuards(JwtAuthGuard)
  // @Put("user")
  // async updateProfile(@TheUser() user: User, @Body() data: UpdateUserDto) {
  //   const payload: Partial<
  //     Pick<User, "name" | "avatarUrl">
  //   > & { avatar?: any } = { ...data };

  //   return this.userService.update(user, payload)
  // }
}
