import Next from 'next';
import { DynamicModule, Module } from '@nestjs/common';
import { RenderModule } from 'nest-next';

import { NODE_ENV } from 'src/shared/constants/env';
import { WebModule } from './web/web.module';
import { ApiModule } from './api/api.module';

declare const module: any;

@Module({})
export class AppModule {
  public static initialize(): DynamicModule {
    const renderModule =
      module.hot?.data?.renderModule ??
      RenderModule.forRootAsync(Next({ dev: NODE_ENV === 'development' }), {
        viewsDir: null,
      });

    if (module.hot) {
      module.hot.dispose((data: any) => {
        data.renderModule = renderModule;
      });
    }

    return {
      module: AppModule,
      imports: [renderModule, WebModule, ApiModule],
    };
  }
}
