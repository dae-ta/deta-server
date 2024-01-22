import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  // router
  controllers: [AppController],
  // 비지니스로직의 분리 transaction 단위로 짜는게 좋음, 요청과 응답에 대해서는 관심없어야함. 테스트, 재사용 쉬워짐.
  providers: [AppService],
})
export class AppModule {}
