import { UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';

import { JwtAuthGuard } from 'src/server/guards/jwt-auth.guard';
import { TodoCreatorGuard } from 'src/server/guards/todo-creator.guard';
import { Todo, TodosResult } from 'src/server/models/todo';
import { User } from 'src/server/models/user';
import { CurrentUser } from '../user/user.decorator';
import { CreateTodoInput } from './dto/create-todo.input';
import { TodoInput } from './dto/todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { TodosParams } from './dto/todos-params.input';
import { TodoService } from './todo.service';

@Resolver()
@UseGuards(JwtAuthGuard)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => TodosResult)
  async getTodos(
    @CurrentUser() user: User,
    @Args('params') params: TodosParams,
  ) {
    const todos = await this.todoService.getTodos({ user, params });
    const totalCount = await this.todoService.getCount(user.id);

    return {
      count: totalCount,
      todos,
    };
  }

  @Query(() => Todo)
  @UseGuards(TodoCreatorGuard)
  getTodo(@Args('todo') todo: TodoInput): Promise<Todo> {
    return this.todoService.getTodo(todo.id);
  }

  @Mutation(() => Todo)
  createTodo(
    @Args('todo') todo: CreateTodoInput,
    @CurrentUser() user: User,
  ): Promise<Todo> {
    return this.todoService.createTodo({ user, todo });
  }

  @Mutation(() => Todo)
  @UseGuards(TodoCreatorGuard)
  updateTodo(@Args('todo') todo: UpdateTodoInput): Promise<Todo> {
    return this.todoService.updateTodo(todo);
  }

  @Mutation(() => [Todo])
  @UseGuards(TodoCreatorGuard)
  deleteTodo(
    @Args('todo') todo: TodoInput,
    @CurrentUser() user: User,
  ): Promise<Todo[]> {
    return this.todoService.deleteTodo({ id: todo.id, user });
  }

  @Mutation(() => [Todo])
  @UseGuards(TodoCreatorGuard)
  toggleTodoCompletion(
    @Args('todo') todo: TodoInput,
    @CurrentUser() user: User,
  ): Promise<Todo[]> {
    return this.todoService.toggleTodoCompletion({ id: todo.id, user });
  }
}
