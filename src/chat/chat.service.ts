import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class ChatService {
  constructor(private readonly redisService: RedisService) {}

  async getChatList(userId: number) {
    const redisClient = this.redisService.getClient();
    const keys: string[] = await redisClient.keys('*'); // 예시로 모든 키를 가져옴, 실제 구현에서는 더 구체적인 키 패턴 사용
    const chats = [];

    for (const key of keys) {
      const chat = await redisClient.get(key);
      console.log(chat, 'chat1');
      if (chat) {
        const parsedChat = JSON.parse(chat);
        if (parsedChat.userId === userId || parsedChat.postUserId === userId) {
          chats.push({
            chatId: key,
            ...parsedChat,
          });
        }
      }
    }

    return chats;
  }

  async getChat(chatId: string) {
    const redisClient = this.redisService.getClient();
    const chat = await redisClient.get(chatId);

    return chat ? JSON.parse(chat) : null;
  }
}
