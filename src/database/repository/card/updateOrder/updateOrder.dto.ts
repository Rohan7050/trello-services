import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CardUpdateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;

  @IsNumber()
  @IsNotEmpty()
  tableId!: number;

  @IsNumber()
  @IsNotEmpty()
  cardId!: string;

  @IsNumber()
  @IsNotEmpty()
  order!: number;
}
