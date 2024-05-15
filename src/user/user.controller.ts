import { Controller, Get, UseGuards } from '@nestjs/common';

import { User } from 'src/@shared/decorator/user.decorator';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AccessTokenGuard)
  findOne(@User() user) {
    if (user) {
      return user;
    }
    return null;
  }
}
