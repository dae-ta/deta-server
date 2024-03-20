import { PostModel } from 'src/post/entities/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('postImage', { schema: 'nest' })
export class PostImageModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text')
  imageUrl: string;

  // 관계 테이블 설정
  @ManyToOne(() => PostModel, (post) => post.Images, {
    nullable: false,
  })
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  Post: PostModel;
}
