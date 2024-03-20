import { S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import multerS3 from 'multer-s3';
import { extname } from 'path';
import { AuthService } from 'src/auth/auth.service';
import { UserModel } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { v4 as uuid } from 'uuid';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
    MulterModule.register({
      limits: {
        // 5MB
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter(req, file, callback) {
        const ext = extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
          return callback(
            new BadRequestException('Only images are allowed'),
            false,
          );
        }

        return callback(null, true);
      },

      storage: multerS3({
        s3: new S3Client({
          region: 'us-east-1',
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        }),
        bucket: 'nestjs-file',
        contentType: (req, file, cb) => {
          cb(null, file.mimetype);
        },
        key: function (req, file, cb) {
          const ext = extname(file.originalname);
          console.log(file);
          cb(null, `${uuid()}${ext}`);
        },
      }),
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService, AuthService, UserService, JwtService],
})
export class CommonModule {}
