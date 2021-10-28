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

  @ManyToOne(() => User, (u) => u.memes, { onDelete: "CASCADE", lazy: true })
  owner: User;

  @Column('jsonb', { unique: true })
  source!: string | File;

  @Column({ nullable: true })
  content?: string;

  @Column({ default: 0 })
  upvotes: number;

  @Column({ default: 0 })
  downvotes: number;

  @Column("text", { nullable: true, array: true })
  categories?: string[];

  @OneToMany(() => Comment, (c) => c.meme, { onDelete: "CASCADE", lazy: true })
  comments: Comment[];

  @ManyToMany(() => Report, { onDelete: "CASCADE", lazy: true })
  @JoinTable()
  reported: Report[];

  @Column(() => Metadata)
  metadata: Metadata;
}
