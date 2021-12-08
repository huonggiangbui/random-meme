import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Storage } from "@google-cloud/storage";

@Injectable()
export default class StorageService {
  private storage: Storage;
  private bucket_name: string;

  constructor() {
    this.storage = new Storage({
      keyFilename: __dirname + "../../../../apps/api/src/app/config/service-account.json",
    });
    this.bucket_name = "random-meme-332221.appspot.com";
  }

  public getStorage(): Storage {
    return this.storage;
  }

  // public uploadPrivateFile(file: Express.Multer.File): Promise<boolean> {
  //   return new Promise((res) => {
  //     createReadStream(file.buffer)
  //       .pipe(
  //         this.storage
  //           .bucket(this.bucket_name)
  //           .file(file.filename)
  //           .createWriteStream()
  //       )
  //       .on("finish", () => {
  //         res(true);
  //       })
  //       .on("error", () => {
  //         res(false);
  //       });
  //   });
  // }

  public async uploadPublicFile(file: Express.Multer.File): Promise<string> {
    const fileRef = this.storage.bucket(this.bucket_name).file(file.filename);
    try {
      await fileRef.save(file.buffer, { contentType: file.mimetype });
      await fileRef.makePublic();
    } catch (error) {
      throw new Error("Something went wrong while upload file!");
    }

    const url = fileRef.publicUrl();
    return url;
  }

  async removeFile(fileName: string): Promise<void> {
    const file = this.storage.bucket(this.bucket_name).file(fileName);
    try {
      await file.delete();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // public async getFileUrl(name: string): Promise<string> {
  //   const url = (
  //     await this.storage
  //       .bucket(this.bucket_name)
  //       .file(name)
  //       .getSignedUrl({
  //         action: "read",
  //         expires: Number(new Date()) + 1000 * 60 * 60, // 1 hour
  //       })
  //   )[0];

  //   return url;
  // }
}
