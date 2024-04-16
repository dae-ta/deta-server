import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/@shared/decorator/user.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('')
  @UseGuards(AccessTokenGuard)
  async getChatList(@User() user) {
    return await this.chatService.getChatList(user.id);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async getChat(@Param('id') chatId: string) {
    const chat = await this.chatService.getChat(chatId);

    return chat;
  }
}
