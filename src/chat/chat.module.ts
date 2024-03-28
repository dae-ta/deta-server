import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from 'src/chat/chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModel } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, UserService, AuthService, JwtService],
})
export class ChatModule {}
