import { NestFactory } from '@nestjs/core';
import { PORT } from 'src/shared/constants/env';
import { AppModule } from './app.module';
import { PrismaService } from './api/modules/prisma/prisma.service';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule.initialize());
  app.get(PrismaService);
  await app.listen(PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
