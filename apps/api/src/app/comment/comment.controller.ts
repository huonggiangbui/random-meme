import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { TheUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @UseGuards(JwtAuthGuard)
  @Post("comments/meme/:id")
  async createMeme(@TheUser() user: User, @Body() body: { content: string }, @Param('id') id: string): Promise<void | Comment> {
    return this.commentService.create(user, body.content, id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete("comments/:id")
  async deleteMeme(@TheUser() user: User, @Param('id') id: string): Promise<void> {
    return this.commentService.remove(user, id)
  }

  @UseGuards(JwtAuthGuard)
  @Put("comments/:id")
  async updateMeme(@TheUser() user: User, @Body() body: { content: string }, @Param('id') id: string) {
    return this.commentService.update(user, body.content, id)
  }
}
