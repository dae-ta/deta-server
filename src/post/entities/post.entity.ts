import { Exclude } from 'class-transformer';
import { PostDateModel } from 'src/post/entities/post-date.entity';
import { PostImageModel } from 'src/post/entities/post-image.entity';
import { UserModel } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('post', { schema: 'nest' })
export class PostModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('text')
  content: string;

  @Column('int')
  payment: number;

  @Column('text')
  startTime: string;

  @Column('text')
  endTime: string;

  @Column('text')
  paymentType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date | null;

  // 관계 테이블 설정
  @OneToMany(() => PostImageModel, (postImage) => postImage.Post, {
    nullable: true,
  })
  Images?: PostImageModel[];

  @ManyToOne(() => UserModel, (user) => user.Posts, {
    nullable: false,
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  User: UserModel;

  @OneToMany(() => PostDateModel, (postDate) => postDate.Post, {
    nullable: false,
  })
  DatesAtMs: PostDateModel[];
}
