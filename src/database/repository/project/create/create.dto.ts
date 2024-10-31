import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class ProjectCreateDto {
  @IsNumber()
  @IsNotEmpty()
  userid!: string;

  @IsNumber()
  @IsNotEmpty()
  projectid!: string;

  @IsNumber()
  @IsNotEmpty()
  accesstype!: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  project_name!: string;

  @IsString()
  @IsNotEmpty()
  desc!: string;
}