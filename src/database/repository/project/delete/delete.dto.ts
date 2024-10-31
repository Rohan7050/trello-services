import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class ProjectDeleteDto {
  @IsNumber()
  @IsNotEmpty()
  projectid!: string;
}
