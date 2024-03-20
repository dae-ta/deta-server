import { CreatePostDto } from 'src/post/dto/create-post.dto';

export interface CreatePostWithUserIdDto extends CreatePostDto {
  userId: number; // 또는 string, 데이터베이스에서 사용하는 ID의 타입에 맞추세요.
}
