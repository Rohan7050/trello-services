import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CardCreateDto {
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;
  
  @IsNumber()
  @IsNotEmpty()
  tableId!: number;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  title!: string;

  @IsNumber()
  @IsNotEmpty()
  order!: number;

  @IsString()
  desc: string;

  @IsString()
  card_color: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}
