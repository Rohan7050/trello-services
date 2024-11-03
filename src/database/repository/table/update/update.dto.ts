import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class TableUpdateDto {
  @IsNumber()
  @IsNotEmpty()
  tableId!: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name!: string;
}
