import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User as IUser } from '@random-meme/shared-types';
import { Report } from '../report/report.entity';
import { Meme } from '../meme/meme.entity';
import { Comment } from '../comment/comment.entity';

@Entity()
export class User implements IUser {
  @Column()
  name: string;

  @PrimaryColumn()
  email: string;

  @Column()
  password: string;

  @Column('jsonb', { nullable: true })
  avatar?: File;

  @OneToMany(() => Meme, (m) => m.owner)
  memes: Meme[];

  @OneToMany(() => Comment, (c) => c.owner)
  comments: Comment[];

  @OneToMany(() => Report, (r) => r.owner)
  my_reports: Report[];

  @ManyToMany(() => Report)
  @JoinTable()
  reported: Report[];

  @Column('text', { array: true, default: [] })
  refresh_tokens: string[];
}
