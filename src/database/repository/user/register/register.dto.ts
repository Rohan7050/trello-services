import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  useremail!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  confirmpassword!: string;
}