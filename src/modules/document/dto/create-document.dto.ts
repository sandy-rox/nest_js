import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string; // The name of the document (could be file name or title)

  @IsString()
  @IsNotEmpty()
  path: string; // The file path where the document is stored
}
