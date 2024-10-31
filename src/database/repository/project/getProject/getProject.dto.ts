import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class ProjectGetAllDto {
  @IsNumber()
  @IsNotEmpty()
  projectid!: string;
}