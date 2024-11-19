import { IsInt, IsNotEmpty } from 'class-validator';

export class TriggerIngestionDto {
  @IsInt() // Ensures fileId is an integer
  @IsNotEmpty() // Ensures fileId is not empty
  fileId: number;
}
