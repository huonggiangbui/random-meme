import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
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
  @UseInterceptors(
    FileInterceptor('source', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 2097152 }, // 2MB --- 2*2^20
      fileFilter: (req, file, callback) => {
        return file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)
          ? callback(null, true)
          : callback(new BadRequestException('Only image files smaller than 2MB are supported'), false);
      }
    })
  )
  @Post("memes")
  async createMeme(@TheUser() user: User, @Body() body: CreateMemeDto, @UploadedFile() source: Express.Multer.File): Promise<void | Meme> {
    if (source) {
      body.source = source;
    }
    return this.memeService.create(user, body)
  }

  @UseGuards(JwtAuthGuard)
  @Delete("memes/:id")
  async deleteMeme(@TheUser() user: User, @Param('id') id: string): Promise<void> {
    return this.memeService.remove(user, id)
  }

  @UseGuards(JwtAuthGuard)
  @Put("memes/:id")
  async updateMeme(@TheUser() user: User, @Body() body: { content: string }, @Param('id') id: string) {
    return this.memeService.update(user, body.content, id)
  }
}
