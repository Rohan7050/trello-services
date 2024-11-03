import { IsNotEmpty, IsNumber } from 'class-validator';

export class CardGetInfoDto {
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;
  
  @IsNumber()
  @IsNotEmpty()
  cardId!: string;
}
