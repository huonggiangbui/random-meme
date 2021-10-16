import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Metadata as IMetadata } from '@random-meme/shared-types';

export class Metadata implements IMetadata {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
