import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { RedisService } from 'nestjs-redis';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { EnterChatDto } from 'src/chat/dto/enter-chat.dto';
import { RedisIoAdapter } from 'src/chat/redis-io-adapter';
import { v4 as uuid } from 'uuid';
// ws://localhost:3000/chat
@WebSocketGateway({
  namespace: 'chat',
  adapter: RedisIoAdapter,
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService,
    private readonly redisService: RedisService,
  ) {}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {}

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('New connection', socket.id);
  }

  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(data, 'create_chat');
    const chatRoomId = uuid();

    await this.redisService.getClient().set(
      chatRoomId,
      JSON.stringify({
        userId: data.userId,
        postUserId: data.postUserId,
        postId: data.postId,
        message: [],
      }),
    );

    socket.join(chatRoomId);

    this.server.in(chatRoomId).emit('receive_chat_id', chatRoomId);
  }

  @SubscribeMessage('enter_chat')
  async enterChat(
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket,
  ) {
    console.log('enter_chat', data);

    // const exist = onlineMap.has(data.chatId);
    const exist = await this.redisService.getClient().get(data.chatId);

    if (!exist) {
      throw new WsException(`${data.chatId} chatId is not exist!`);
    }

    socket.join(data.chatId);
  }

  // socket.on('sendMessage', (message) => { console.log(message)})
  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() data: { message: string; chatId: string; senderId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(data.message);

    const newMessage = {
      content: data.message,
      senderId: data.senderId,
      createdAt: `${new Date().getTime()}`,
    };

    const redisClient = this.redisService.getClient();

    // Redis에서 채팅방 데이터 가져오기 (data.chatId는 채팅방 식별자)
    const chatRoomData = await redisClient.get(data.chatId);

    if (chatRoomData) {
      // JSON 문자열을 객체로 변환
      const chatRoom = JSON.parse(chatRoomData);

      // 메시지 리스트에 새 메시지 추가
      chatRoom.message.push(newMessage);

      // 객체를 JSON 문자열로 변환하여 Redis에 다시 저장
      await redisClient.set(data.chatId, JSON.stringify(chatRoom));

      // 이 방에 있는 모든 사용자에게 보냄
      this.server.in(data.chatId).emit('receive_message', newMessage);
    }

    // chatRoom.message.push(newMessage);

    // 이 방에 있는 모든 사용자에게 보냄 (나를 제외) Boradcast
    // socket.to(data.chatId).emit('receive_message', data.message);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('Disconnected', socket.id);
  }
}
