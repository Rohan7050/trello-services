import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ProjectCreateDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  project_name!: string;

  @IsString()
  @IsNotEmpty()
  desc!: string;
}