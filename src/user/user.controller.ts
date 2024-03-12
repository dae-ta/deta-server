import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';

import { User } from 'src/shared/decorator/user.decorator';
import { UserService } from './user.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('logout')
  async logout(@Res() res) {
    res.clearCookie('connect.sid', { httpOnly: true });
    return res.send('ok');
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  findOne(@User() user) {
    if (user) {
      return user;
    }
    return null;
  }
}
