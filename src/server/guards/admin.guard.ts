import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-core';
import { UserService } from '../api/modules/user/user.service';

// Check if username in field for query matches authenticated user's username
// or if the user is admin
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private usersService: UserService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    if (request.user) {
      const user = request.user;
      if (this.usersService.isAdmin(user)) return true;
    }
    throw new AuthenticationError(
      'Could not authenticate with token or user does not have permissions',
    );
  }
}
