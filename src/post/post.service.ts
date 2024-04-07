import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostDateModel } from 'src/post/entities/post-date.entity';
import { PostImageModel } from 'src/post/entities/post-image.entity';
import { PostModel } from 'src/post/entities/post.entity';
import { QueryRunner, Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(PostImageModel)
    private readonly postImageRepository: Repository<PostImageModel>,
    @InjectRepository(PostDateModel)
    private readonly PostDateRepository: Repository<PostDateModel>,
  ) {}

  async createPost({
    title,
    content,
    payment,
    paymentType,
    startTime,
    endTime,
    userId,
    queryRunner,
  }: {
    title: string;
    content: string;
    payment: number;
    paymentType: string;
    startTime: string;
    endTime: string;
    userId: number;
    queryRunner?: QueryRunner;
  }) {
    const createPostDto = {
      title: title,
      content: content,
      payment,
      paymentType,
      startTime,
      endTime,
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

  async createDatesAtMs(
    postId: number,
    dateAtMs: number,
    queryRunner?: QueryRunner,
  ) {
    const postDate = {
      Post: {
        id: postId,
      },
      dateAtMs,
    };
    if (queryRunner) {
      return queryRunner.manager
        .getRepository<PostDateModel>(PostDateModel)
        .save(postDate);
    } else {
      return this.PostDateRepository.save(postDate);
    }
  }

  async findAll() {
    const a = await this.postRepository.find({
      relations: ['Images', 'DatesAtMs'],
    });

    console.log(a);
    return this.postRepository.find({
      relations: ['Images', 'DatesAtMs'],
    });
  }

  async findOne(id: number) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['Images', 'User', 'DatesAtMs'],
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
