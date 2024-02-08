import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    const result = await this.userRepository.findOneBy({ email: user.email });

    if (result) {
      throw new UnauthorizedException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);

    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
