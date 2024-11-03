import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class ProjectUpdateDto {
  @IsNumber()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  project_name!: string;

  @IsString()
  @IsNotEmpty()
  desc!: string;
}
