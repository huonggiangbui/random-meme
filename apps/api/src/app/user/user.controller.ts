import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Tokens } from '../types/Tokens';
import { CreateUserDto } from './dto/create-user';
import { SignInDto } from './dto/sign-in';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TheUser } from './user.decorator';
import { User } from './user.entity';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user';

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

  @Get("users/:email")
  async getUserInfo(@Param() params): Promise<Omit<User, "password" | "refresh_tokens">> {
    return this.userService.getProfile(params.email)
  }

  @UseGuards(JwtAuthGuard)
  @Put("user")
  async updateProfile(@TheUser() user: User, @Body() data: UpdateUserDto) {
    const payload: Partial<
      Pick<User, "name" | "avatarUrl">
    > & { avatar?: any } = { ...data };

    return this.userService.update(user, payload)
  }
}
