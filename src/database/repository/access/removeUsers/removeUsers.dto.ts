import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveUsersDto {
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;

  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}
