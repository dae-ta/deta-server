import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';

import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
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
      entities: [User],
      synchronize: true,

    }),
    UserModule,
    AuthModule,
  ],
  // router
  controllers: [AppController],
  // 비지니스로직의 분리 transaction 단위로 짜는게 좋음, 요청과 응답에 대해서는 관심없어야함. 테스트, 재사용 쉬워짐.
  providers: [AppService, ConfigService],
})

export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
  
}
