import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/@shared/decorator/user.decorator';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';
import { TransactionInterceptor } from 'src/@shared/interceptor/transaction-interceptor';
import { QueryRunner } from 'src/@shared/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async create(
    @User() user,
    @Body() createPostDto: CreatePostDto,
    @QueryRunner() queryRunner: QR,
  ) {
    const {
      title,
      content,
      payment,
      paymentType,
      startTime,
      endTime,
      datesAtMs,
      imagePaths,
    } = createPostDto;

    const postId = await this.postService.createPost({
      title,
      content,
      payment,
      paymentType,
      startTime,
      endTime,
      userId: user.id,
      queryRunner,
    });

    if (imagePaths.length > 0) {
      await Promise.all([
        ...imagePaths.map(async (imagePath) => {
          this.postService.createImage(postId, imagePath, queryRunner);
        }),
      ]);
    }

    if (datesAtMs.length > 0) {
      await Promise.all(
        datesAtMs.map(async (dateAtMs) => {
          this.postService.createDatesAtMs(postId, dateAtMs, queryRunner);
        }),
      );
    }

    return postId;
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findAll(@User() user) {
    return await this.postService.findAll();
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.postService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.postService.remove(+id);
  }
}
