import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { RegisterInput } from './dto/register.input';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginInput } from './dto/login.input';
import { LoginResult, User } from 'src/server/models/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  register(registerInput: RegisterInput): Promise<User> {
    return this.prisma.user.create({ data: registerInput });
  }

  async checkPassword(plainPassword: string, password: string) {
    return await bcrypt.compare(plainPassword, password);
  }

  async validateUserByPassword(
    loginAttempt: LoginInput,
  ): Promise<LoginResult | undefined> {
    let userToAttempt: User | null;
    userToAttempt = await this.prisma.user.findFirst({
      where: { name: loginAttempt.name },
    });

    let isMatch = false;
    if (!userToAttempt || !userToAttempt.password) return undefined;
    try {
      isMatch = await this.checkPassword(
        loginAttempt.password,
        userToAttempt.password,
      );
    } catch (error) {
      return undefined;
    }

    if (isMatch) {
      const token = this.signToken(userToAttempt);
      const result: LoginResult = {
        user: userToAttempt!,
        token,
      };
      return result;
    }

    return undefined;
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User | null;

    try {
      user = await this.prisma.user.findFirst({
        where: { name: payload.sub },
      });
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with name: ${payload.sub}`,
      );
    }

    if (!user) {
      throw new UnauthorizedException(
        `There isn't any user with name: ${payload.sub}`,
      );
    }
    if (user.password) delete user.password;

    return user;
  }

  signToken(user: User): string {
    const payload = {
      sub: user.name,
    };

    return this.jwtService.sign(payload);
  }
}
