import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(userId: number, done: CallableFunction) {
    return await this.userRepository
      .findOneOrFail({
        where: {
          id: userId,
        },
        select: ['id', 'email'],
      })
      .then((user) => {
        done(null, user); // req.user
      })
      .catch((error) => {
        done(error, null);
      });
  }
}
