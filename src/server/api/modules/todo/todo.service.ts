import { Injectable } from '@nestjs/common';

import { User } from 'src/server/models/user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { TodosParams } from './dto/todos-params.input';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  createTodo({ user, todo }: { user: User; todo: CreateTodoInput }) {
    const data = {
      title: todo.title,
      description: todo.description,
      user: {
        connect: {
          id: user.id,
        },
      },
    };

    return this.prisma.todo.create({
      data,
      include: {
        user: true,
      },
    });
  }

  getTodo(id: number) {
    return this.prisma.todo.findFirstOrThrow({
      where: { id },
    });
  }

  getTodos({ user, params }: { user: User; params: TodosParams }) {
    const { perPage, page } = params;
    return this.prisma.todo.findMany({
      where: { userId: user.id },
      skip: perPage * page,
      take: perPage,
    });
  }

  updateTodo(todo: UpdateTodoInput) {
    return this.prisma.todo.update({
      data: {
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      },
      where: {
        id: todo.id,
      },
    });
  }

  async deleteTodo({ id, user }: { id: number; user: User }) {
    await this.prisma.todo.delete({
      where: { id: id },
    });
    return await this.prisma.todo.findMany({
      where: { userId: user.id },
    });
  }

  async toggleTodoCompletion({ id, user }: { id: number; user: User }) {
    const todo = await this.prisma.todo.findFirstOrThrow({
      where: { id },
    });
    await this.prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed },
    });

    return await this.prisma.todo.findMany({
      where: { userId: user.id },
    });
  }

  getCount(id: number) {
    return this.prisma.todo.count({
      where: { userId: id },
    });
  }
}
