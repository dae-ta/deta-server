import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CommonService } from './common.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('images')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FilesInterceptor('files'))
  postImage(@UploadedFiles() files?: Array<Express.MulterS3.File>) {
    console.log(files, 'files');
    return {
      fileNames: files.map((file) => file.key),
    };
  }
}
