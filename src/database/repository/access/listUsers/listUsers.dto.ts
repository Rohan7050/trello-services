import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class ListUsersDto {
  @IsNumber()
  @IsNotEmpty()
  projectId: string;
}