import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddUsersDto {
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;
  
  @IsNumber()
  @IsNotEmpty()
  userId!: number;

  @IsNumber()
  @IsNotEmpty()
  accesstype!: number;
}
