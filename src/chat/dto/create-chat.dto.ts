import { IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  userId: number;
  @IsNumber()
  postUserId: number;
  @IsNumber()
  postId: number;
}
