import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Report as IReport } from '@random-meme/shared-types';
import { Metadata } from '../utils/metadata.type';
import { User } from '../user/user.entity';

@Entity()
export class Report implements IReport {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (u) => u.my_reports)
  owner: User;

  @Column(() => Metadata)
  metadata: Metadata;
}
