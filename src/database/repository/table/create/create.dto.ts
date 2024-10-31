import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class TableCreateDto {
  @IsNumber()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name!: string;
}
