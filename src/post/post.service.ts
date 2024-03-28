import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostImageModel } from 'src/post/entities/post-image.entity';
import { PostModel } from 'src/post/entities/post.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(PostImageModel)
    private readonly postImageRepository: Repository<PostImageModel>,
    private readonly dataSource: DataSource,
  ) {}

  async createPost({
    title,
    content,
    userId,
    queryRunner,
  }: {
    title: string;
    content: string;
    userId: number;
    queryRunner?: QueryRunner;
  }) {
    const createPostDto = {
      title: title,
      content: content,
      User: {
        id: userId,
      },
    };

    if (queryRunner) {
      const post = await queryRunner.manager
        .getRepository<PostModel>(PostModel)
        .save(createPostDto);

      return post.id;
    } else {
      const post = await this.postRepository.save(createPostDto);

      return post.id;
    }
  }

  async createImage(
    postId: number,
    imageUrl: string,
    queryRunner?: QueryRunner,
  ) {
    const postImage = {
      Post: {
        id: postId,
      },
      imageUrl: imageUrl,
    };
    if (queryRunner) {
      return queryRunner.manager
        .getRepository<PostImageModel>(PostImageModel)
        .save(postImage);
    } else {
      return this.postImageRepository.save(postImage);
    }
  }

  async findAll() {
    return this.postRepository.find({
      relations: ['Images'],
    });
  }

  async findOne(id: number) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['Images', 'User'],
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
