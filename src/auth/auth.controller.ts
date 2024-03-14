import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { RefreshTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    return await this.authService.login(createUserDto);
  }

  @Post('join')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  // accessToken 재발급하는 API
  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  accessToken(@Headers('authorization') rowToken: string) {
    const token = this.authService.extractTokenFromHeader(rowToken);

    const newToken = this.authService.refreshAccessToken(token, true);
    const newRefreshToken = this.authService.refreshAccessToken(token, false);

    return {
      accessToken: newToken,
      refreshToken: newRefreshToken,
      expiredAt: String(new Date().getTime() + 1000 * 60 * 5),
    };
  }

  // refreshToken 재발급하는 API
  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Headers('authorization') rowToken: string) {
    const token = this.authService.extractTokenFromHeader(rowToken);

    const newToken = this.authService.refreshAccessToken(token, false);

    return { refreshToken: newToken };
  }
}
