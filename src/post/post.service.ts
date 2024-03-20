import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostModel } from 'src/post/entities/post.entity';
import { CreatePostWithUserIdDto } from 'src/post/types';
import { Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostImageModel } from 'src/post/entities/post-image.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(PostImageModel)
    private readonly postImageRepository: Repository<PostImageModel>,
  ) {}
  async create({
    title,
    content,
    userId,
    imagePaths,
  }: CreatePostWithUserIdDto) {
    const post = await this.postRepository.save({
      title: title,
      content: content,
      User: {
        id: userId,
      },
    });

    await Promise.all(
      imagePaths.map((imageUrl) => {
        this.postImageRepository.save({
          Post: {
            id: post.id,
          },
          imageUrl: imageUrl,
        });
      }),
    );

    return post.id;
  }

  async findAll() {
    return this.postRepository.find({
      relations: ['Images'],
    });
  }

  async findOne(id: number) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['Images'],
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.postRepository.save({ id, ...updatePostDto });
  }

  async remove(id: number) {
    return this.postRepository.delete({ id });
  }
}
