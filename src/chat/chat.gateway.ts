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
import { Server, Socket } from 'socket.io';
import { onlineMap } from 'src/@shared/constants';
import { ChatService } from 'src/chat/chat.service';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { EnterChatDto } from 'src/chat/dto/enter-chat.dto';
import { v4 as uuid } from 'uuid';

@WebSocketGateway({
  // ws://localhost:3000/chat
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('server Init');
  }

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
    onlineMap.set(chatRoomId, {
      userId: data.userId,
      postUserId: data.postUserId,
      postId: data.postId,
      message: [],
    });

    socket.join(chatRoomId);

    this.server.in(chatRoomId).emit('receive_chat_id', chatRoomId);

    // const chat = await this.chatService.createChat(data);
  }

  @SubscribeMessage('enter_chat')
  async enterChat(
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket,
  ) {
    console.log('enter_chat', data);
    // const exist = await this.chatService.checkChatExist(chatId);
    const exist = onlineMap.has(data.chatId);

    if (!exist) {
      throw new WsException(`${data.chatId} chatId is not exist!`);
    }

    socket.join(data.chatId);
  }

  // socket.on('sendMessage', (message) => { console.log(message)})
  @SubscribeMessage('send_message')
  sendMessage(
    @MessageBody() data: { message: string; chatId: string; senderId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    const chatRoom = onlineMap.get(data.chatId);

    const newMessage = {
      content: data.message,
      senderId: data.senderId,
      createdAt: `${new Date().getTime()}`,
    };

    console.log(newMessage.createdAt);

    chatRoom.message.push(newMessage);

    // 이 방에 있는 모든 사용자에게 보냄
    this.server.in(data.chatId).emit('receive_message', newMessage);

    // // 이 방에 있는 모든 사용자에게 보냄 (나를 제외) Boradcast
    // socket.to(data.chatId).emit('receive_message', data.message);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('Disconnected', socket.id);
  }
}
