import { HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver, Args, Context } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-core';

import { JwtAuthGuard } from 'src/server/guards/jwt-auth.guard';
import { User, LoginResult } from 'src/server/models/user';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Context('req') request: any): Promise<User> {
    const user: User = request.user;
    if (!user)
      throw new AuthenticationError(
        'Could not log-in with the provided credentials',
      );
    return user;
  }

  @Mutation(() => User)
  async login(@Args('user') user: LoginInput): Promise<LoginResult> {
    const result = await this.authService.validateUserByPassword(user);
    if (result) return result;
    throw new AuthenticationError(
      'Could not log-in with the provided credentials',
    );
  }

  @Mutation(() => User)
  @HttpCode(HttpStatus.CREATED)
  register(@Args('registerData') registerData: RegisterInput): Promise<User> {
    return this.authService.register(registerData);
  }
}
