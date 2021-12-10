export class CreateMemeDto {
  source: string | Express.Multer.File;
  content?: string;
}