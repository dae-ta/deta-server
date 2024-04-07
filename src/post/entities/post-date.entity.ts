import { PostModel } from 'src/post/entities/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('postDate', { schema: 'nest' })
export class PostDateModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('bigint')
  dateAtMs: number;

  // 관계 테이블 설정
  @ManyToOne(() => PostModel, (post) => post.DatesAtMs, {
    nullable: false,
  })
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  Post: PostModel;
}
