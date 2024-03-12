import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Sign token
   */
  signToken({
    user,
    isAccessToken,
  }: {
    user: Pick<User, 'id' | 'email'>;
    isAccessToken: boolean;
  }) {
    const { id, email } = user;
    const payload = {
      sub: id,
      email,
      type: isAccessToken ? 'access' : 'refresh',
    };

    return this.jwtService.sign(payload, {
      expiresIn: isAccessToken ? '5m' : '10m',
      secret: process.env.JWT_SECRET,
    });
  }

  /**
   * Generate login tokens
   */
  generateLoginTokens(user: User): {
    accessToken: string;
    refreshToken: string;
    expiredAt: string;
  } {
    return {
      accessToken: this.signToken({ user, isAccessToken: true }),
      refreshToken: this.signToken({ user, isAccessToken: false }),
      expiredAt: String(new Date().getTime() + 1000 * 60 * 5),
    };
  }

  async login(user: Pick<User, 'email' | 'password'>) {
    const existingUser = await this.validateUser(user);
    console.log(existingUser, 'existingUser');

    return this.generateLoginTokens(existingUser);
  }

  /**
   * Validate user
   */
  async validateUser(user: Pick<User, 'email' | 'password'>): Promise<any> {
    const { email, password } = user;
    const existingUser = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (existingUser) {
      const isValidPassword = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (isValidPassword === true) {
        return existingUser;
      }
    }

    throw new UnauthorizedException(
      '이메일 또는 비밀번호가 일치하지 않습니다.',
    );
  }

  /**
   * Create user
   */
  async createUser(user: CreateUserDto) {
    const result = await this.userRepository.existsBy({ email: user.email });

    if (result) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });

    return this.login(user);
  }

  /**
   * Extract token from rowToken
   */
  extractTokenFromHeader(rowToken: string) {
    const splitToken = rowToken.split(' ');

    if (splitToken.length !== 2 || splitToken[0] !== 'Bearer') {
      throw new BadRequestException('Invalid token');
    }
    return splitToken[1];
  }

  /**
   * Verify token
   */
  verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  refreshAccessToken(token: string, isAccessToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    console.log(decoded, 'decoded');

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('decoded.type이 refresh가 아닙니다.');
    }

    return this.signToken({
      user: {
        id: decoded.sub,
        email: decoded.email,
      },
      isAccessToken: isAccessToken,
    });
  }
}
