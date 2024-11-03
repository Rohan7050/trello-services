import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CardUpdateDto {
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;

  @IsNumber()
  @IsNotEmpty()
  tableId!: number;

  @IsNumber()
  @IsNotEmpty()
  cardId!: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  title!: string;

  @IsNumber()
  @IsNotEmpty()
  order!: number;

  @IsString()
  desc!: string;

  @IsString()
  @MaxLength(10)
  card_color!: string;

  @IsOptional()
  @IsDate()
  start_date: Date;

  @IsOptional()
  @IsDate()
  end_date: Date;
}
