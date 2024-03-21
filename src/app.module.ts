import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from 'src/@shared/middlewares/logger.middleware';

import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm';
import { UserModel } from 'src/user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PostModule } from './post/post.module';
import { PostModel } from 'src/post/entities/post.entity';
import { PostImageModel } from 'src/post/entities/post-image.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from 'src/@shared/constants';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UserModel, PostModel, PostImageModel],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    PostModule,
    CommonModule,
  ],
  // router
  controllers: [AppController],
  // 비지니스로직의 분리 transaction 단위로 짜는게 좋음, 요청과 응답에 대해서는 관심없어야함. 테스트, 재사용 쉬워짐.
  providers: [
    AppService,
    ConfigService,
    {
      // @Exclude 적용을 위해
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
