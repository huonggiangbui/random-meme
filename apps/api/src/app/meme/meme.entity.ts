import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Meme as IMeme } from '@random-meme/shared-types';
import { Metadata } from '../utils/metadata.type';
import { Report } from '../report/report.entity';
import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';

@Entity()
export class Meme implements IMeme {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (u) => u.memes)
  owner: User;

  @Column('jsonb')
  source: string | File;

  @Column()
  content: string;

  @Column({ default: 0 })
  upvotes: number;

  @Column({ default: 0 })
  downvotes: number;

  @OneToMany(() => Comment, (c) => c.meme)
  comments: Comment[];

  @ManyToMany(() => Report)
  @JoinTable()
  reported: Report[];

  @Column(() => Metadata)
  metadata: Metadata;
}
