export class CreateUserDto {
  email: string;
  password: string;
  name: string;
  avatar?: File;
}