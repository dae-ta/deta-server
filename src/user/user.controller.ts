import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import { NotLoggedInGuard } from 'src/auth/guard/not-logged-in-guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from 'src/shared/decorator/user.decorator';
import { LoggedInGuard } from 'src/auth/guard/logged-in.quard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(NotLoggedInGuard)
  @Post('join')
  async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
  }

  @UseGuards(...[NotLoggedInGuard, LocalAuthGuard])
  @Post('login')
  async login(@Req() req) {
    return req.user;
  }

  @UseGuards(LoggedInGuard)
  @Post('logout')
  async logout(@Res() res) {
    res.clearCookie('connect.sid', { httpOnly: true });
    return res.send('ok');
  }

  @Get('me')
  findOne(@User() user) {
    if (user) {
      return user;
    }
    return null;
  }
}
