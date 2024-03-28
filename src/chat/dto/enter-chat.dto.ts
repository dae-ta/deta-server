import { IsString } from 'class-validator';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';

export class EnterChatDto extends CreateChatDto {
  @IsString()
  chatId: string;
}
