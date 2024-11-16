import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAcessDto {
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
