import { IsNotEmpty, IsNumber} from 'class-validator';

export class ProjectDeleteDto {
  @IsNumber()
  @IsNotEmpty()
  projectId!: string;
}
