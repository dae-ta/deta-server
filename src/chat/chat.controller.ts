import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/@shared/decorator/user.decorator';
import { onlineMap } from 'src/@shared/constants';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('')
  @UseGuards(AccessTokenGuard)
  getChatList(@User() user) {
    console.log(onlineMap, 'onlineMap');
    const filteredValue = [...onlineMap].filter(([, value]) => {
      console.log(value.postId, user.id);
      if (value.userId === user.id || value.postUserId === user.id) {
        return true;
      }

      return false;
    });

    if (filteredValue.length === 0) {
      return [];
    }

    return filteredValue.map(([key, value]) => {
      return {
        chatId: key,
        postId: value.postId,
        userId: value.userId,
        postUserId: value.postUserId,
        message: value.message,
      };
    });
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  getChat(@Param('id') chatId: string) {
    console.log(onlineMap, 'onlineMap');
    const chat = onlineMap.get(chatId);

    return chat;
  }
}
