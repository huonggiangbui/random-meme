import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Tokens } from '../types/Tokens';
import { CreateUserDto } from './dto/create-user';
import { SignInDto } from './dto/sign-in';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TheUser } from './user.decorator';
import { User } from './user.entity';

import { User as IUser } from '@random-meme/shared-types';

import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  getData(): { message: string } {
    return { message: 'Welcome to api!' };
  }

  @Post("users")
  async register(@Body() body: CreateUserDto): Promise<void | User> {
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
  async signout(@Body() body: { refresh_token: string }): Promise<boolean>{
    return this.userService.disableRefreshToken(body.refresh_token)
  }

  @Delete("sessions")
  @UseGuards(JwtAuthGuard)
  async signOutAllDevices(@TheUser() user: User): Promise<number> {
    return this.userService.disableAllRefreshTokens(user)
  }

  @Get("users/:email")
  async getUserInfo(@Param() params): Promise<IUser> {
    const user = await this.userService.findByEmail(params.email)
    return user
  }

  @UseGuards(JwtAuthGuard)
  @Get("user")
  async me(@TheUser() user: User): Promise<IUser> {
    return user
  }
}
