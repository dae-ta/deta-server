import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { PostImageModel } from 'src/post/entities/post-image.entity';
import { PostModel } from 'src/post/entities/post.entity';
import { UserModel } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostDateModel } from 'src/post/entities/post-date.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostModel,
      PostImageModel,
      UserModel,
      PostDateModel,
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, AuthService, UserService, JwtService],
})
export class PostModule {}
