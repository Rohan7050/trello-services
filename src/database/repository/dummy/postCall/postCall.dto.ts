import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class PostCallDto {
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  age!: number;
}
