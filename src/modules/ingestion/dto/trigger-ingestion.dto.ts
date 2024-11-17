import { IsString, IsNotEmpty } from 'class-validator';

export class TriggerIngestionDto {
  @IsString()
  @IsNotEmpty()
  fileId: number;
}
