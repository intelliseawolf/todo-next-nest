import { Controller, Get, Render, UseInterceptors } from '@nestjs/common';
import { ParamsInterceptor } from '../../params.interceptor';
import { ConfigInterceptor } from '../../config.interceptor';

@Controller()
export class WebController {
  @Get('/')
  @Render('index')
  @UseInterceptors(ParamsInterceptor, ConfigInterceptor)
  home() {
    return {};
  }

  @Get('/user')
  @Render('users')
  @UseInterceptors(ParamsInterceptor, ConfigInterceptor)
  user() {
    return {};
  }

  @Get('/user/add')
  @Render('users/add')
  @UseInterceptors(ParamsInterceptor, ConfigInterceptor)
  userAdd() {
    return {};
  }

  @Get('/todo')
  @Render('todo')
  @UseInterceptors(ParamsInterceptor, ConfigInterceptor)
  todo() {
    return {};
  }

  @Get('/todo/add')
  @Render('todo/add')
  @UseInterceptors(ParamsInterceptor, ConfigInterceptor)
  todoAdd() {
    return {};
  }

  @Get('/todo/:id')
  @Render('todo/edit')
  @UseInterceptors(ParamsInterceptor, ConfigInterceptor)
  todoEdit() {
    return {};
  }
}
