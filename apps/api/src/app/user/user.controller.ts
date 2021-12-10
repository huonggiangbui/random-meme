import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Tokens } from '../types/Tokens';
import { CreateUserDto } from './dto/create-user';
import { SignInDto } from './dto/sign-in';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TheUser } from './user.decorator';
import { User } from './user.entity';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user';
import multer = require('multer');
import path = require('path');

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post("users")
  async register(@Body() body: CreateUserDto): Promise<void | Omit<User, "password" | "refresh_tokens">> {
    return this.userService.create(body)
  }

  // Authentication
  @Post("sessions")
  async signin(@Body() body: SignInDto): Promise<Tokens> {
    if (body.email && body.password) {
      return this.userService.signinWithCredentials(body.email, body.password)
    } else if (body.refresh_token) {
      return {
        access_token: await this.userService.refreshToken(body.refresh_token),
        refresh_token: body.refresh_token
      }
    } else {
      throw new Error('Must provide credential or refresh token');
    }
  }

  @Delete("session")
  async signout(@Body() body: { refresh_token: string }): Promise<boolean> {
    return this.userService.disableRefreshToken(body.refresh_token)
  }

  @Delete("sessions")
  @UseGuards(JwtAuthGuard)
  async signOutAllDevices(@TheUser() user: User): Promise<number> {
    return this.userService.disableAllRefreshTokens(user)
  }

  @Get("users/:id")
  async getUserInfo(@Param() params): Promise<Omit<User, "password" | "refresh_tokens">> {
    return this.userService.getProfile(params.id)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 2097152 }, // 2MB --- 2*2^20
      fileFilter: (req, file, callback) => {
        return file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)
          ? callback(null, true)
          : callback(new BadRequestException('Only image files are allowed'), false);
      }
    })
  )
  @Put("user")
  async updateProfile(@TheUser() user: User, @Body() data: UpdateUserDto, @UploadedFile() avatar: Express.Multer.File) {
    const payload: Partial<
      Pick<User, "name" | "password">
    > & { avatar?: any } = { ...data };

    return this.userService.update(user, payload, avatar)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user')
  deleteUser(@TheUser() user: User) {
    return this.userService.remove(user)
  }
}
