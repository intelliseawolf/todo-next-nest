import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'src/server/models/user';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  createUser(createUserData: CreateUserInput) {
    return this.prisma.user.create({ data: createUserData });
  }

  getUsers() {
    return this.prisma.user.findMany();
  }

  async deleteUser(id: number) {
    await this.prisma.user.delete({
      where: { id },
    });
    return this.prisma.user.findMany();
  }

  isAdmin(user: User) {
    return user.role === 'admin';
  }
}
