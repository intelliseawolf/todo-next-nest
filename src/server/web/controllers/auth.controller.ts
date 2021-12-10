import { Controller, Get, Render, UseInterceptors } from '@nestjs/common';
import { ParamsInterceptor } from '../../params.interceptor';
import { ConfigInterceptor } from '../../config.interceptor';

@Controller()
export class AuthController {
  @Get('login')
  @Render('login')
  @UseInterceptors(ParamsInterceptor, ConfigInterceptor)
  login() {
    return {};
  }

  @Get('register')
  @Render('register')
  @UseInterceptors(ParamsInterceptor, ConfigInterceptor)
  register() {
    return {};
  }
}
