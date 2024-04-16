import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from 'src/@shared/middlewares/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from 'src/@shared/constants';
import { RedisIoAdapter } from 'src/chat/redis-io-adapter';
import { PostDateModel } from 'src/post/entities/post-date.entity';
import { PostImageModel } from 'src/post/entities/post-image.entity';
import { PostModel } from 'src/post/entities/post.entity';
import { UserModel } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { CommonModule } from './common/common.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { RedisModule } from 'nestjs-redis';

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
      entities: [UserModel, PostModel, PostImageModel, PostDateModel],
      synchronize: true,
    }),
    RedisModule.register({
      host: `redis-17770.c267.us-east-1-4.ec2.cloud.redislabs.com`,
      port: 17770,
      password: 'tEYlBUd9FxIgH7zLLMzlhh1mIN5I1abe',
      username: 'default',
      connectTimeout: 10000,
      db: 0,
      enableReadyCheck: true,
    }),
    UserModule,
    AuthModule,
    PostModule,
    CommonModule,
    ChatModule,
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
