import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Comment as IComment } from '@random-meme/shared-types';
import { Metadata } from '../utils/metadata.type';
import { Meme } from '../meme/meme.entity';
import { Report } from '../report/report.entity';
import { User } from '../user/user.entity';

@Entity()
export class Comment implements IComment {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (u) => u.comments)
  owner: User;

  @Column()
  content: string;

  @ManyToOne(() => Meme, (m) => m.comments)
  meme: Meme;

  @ManyToMany(() => Report)
  @JoinTable()
  reported: Report[];

  @Column(() => Metadata)
  metadata: Metadata;
}
