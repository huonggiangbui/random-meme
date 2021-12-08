import { Module } from '@nestjs/common';
import StorageService from '../storage/storage.service';

@Module({
  imports: [],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule { }
