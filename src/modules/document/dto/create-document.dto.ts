import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for creating a document.
 * It contains the necessary fields to define a document: its name and storage path.
 */
export class CreateDocumentDto {
  /**
   * The name of the document (could be file name or title).
   * @example "invoice.pdf"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * The file path where the document is stored.
   * @example "/documents/invoices/invoice.pdf"
   */
  @IsString()
  @IsNotEmpty()
  path: string;
}
