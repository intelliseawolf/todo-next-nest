import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from '../../../models/user';
import { CreateUserInput } from './dto/create-user.input';
import { JwtAuthGuard } from 'src/server/guards/jwt-auth.guard';
import { AdminGuard } from 'src/server/guards/admin.guard';

@Resolver()
@UseGuards(JwtAuthGuard, AdminGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(
    @Args('createUserData') createUserData: CreateUserInput,
  ): Promise<User> {
    return this.userService.createUser(createUserData);
  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @Mutation(() => [User])
  deleteUser(@Args('id') id: number): Promise<User[]> {
    return this.userService.deleteUser(id);
  }
}
