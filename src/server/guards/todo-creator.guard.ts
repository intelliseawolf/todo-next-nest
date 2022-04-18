import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../api/modules/prisma/prisma.service';

/**
 * Checks if user can edit own article.
 */
@Injectable()
export class TodoCreatorGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const graphqlContext = GqlExecutionContext.create(context);
    const request = graphqlContext.getContext().req;
    const todoId = context.getArgByIndex(1)?.todo?.id;

    if (!(request.user && todoId)) {
      return false;
    }
    const todo = await this.prisma.todo.findUnique({
      where: {
        id: todoId,
      },
      select: { userId: true },
    });

    return Boolean(todo && todo.userId === request.user.id);
  }
}
