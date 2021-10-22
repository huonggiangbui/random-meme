import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { TheUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { CreateMemeDto } from './dto/create-meme';
import { UpdateMemeDto } from './dto/update-meme';
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
  async deleteMeme(@TheUser() user: User, @Param('id') id: string): Promise<void> {
    return this.memeService.remove(user, id)
  }

  @UseGuards(JwtAuthGuard)
  @Put("meme")
  async updateMeme(@TheUser() user: User, @Body() data: UpdateMemeDto) {
    const payload: Partial<
      Pick<Meme, "id" | "content">
    > = { ...data };

    return this.memeService.update(user, payload)
  }
}
