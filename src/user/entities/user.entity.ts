import { Exclude } from 'class-transformer';
import { PostModel } from 'src/post/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user', { schema: 'nest' })
export class UserModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { unique: true, length: 30 })
  email: string;

  @Column('varchar', { unique: true, length: 60, select: false })
  @Exclude()
  password: string;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date | null;

  // 관계 테이블 설정
  @OneToMany(() => PostModel, (post) => post.User)
  Posts: PostModel[];
}
