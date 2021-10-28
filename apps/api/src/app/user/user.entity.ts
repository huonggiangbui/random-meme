import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { User as IUser } from '@random-meme/shared-types';
import { Report } from '../report/report.entity';
import { Meme } from '../meme/meme.entity';
import { Comment } from '../comment/comment.entity';

@Entity()
export class User implements IUser {
  @Column()
  name: string;

  @PrimaryColumn({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password!: string;

  @Column('jsonb', { nullable: true })
  avatarUrl?: string;

  @OneToMany(() => Meme, (m) => m.owner, { onDelete: "RESTRICT", lazy: true })
  memes: Meme[];

  @OneToMany(() => Comment, (c) => c.owner)
  comments: Promise<Comment[]>;

  @OneToMany(() => Report, (r) => r.owner)
  my_reports: Promise<Report[]>;

  @ManyToMany(() => Report, { onDelete: "CASCADE", lazy: true })
  @JoinTable()
  reported: Report[];

  @Column('text', { array: true, default: [] })
  refresh_tokens: string[];
}
