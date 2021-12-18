import { Module } from '@nestjs/common';
import { WebController } from './controllers/web.controller';
import { AuthController } from './controllers/auth.controller';

@Module({
  controllers: [AuthController, WebController],
})
export class WebModule {}
