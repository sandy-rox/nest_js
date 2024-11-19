import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Assuming User entity exists

/**
 * Entity representing a document in the system.
 * It holds information about the document name, path, upload time, and the user associated with it.
 */
@Entity()
export class Document {
  /**
   * The unique identifier for the document.
   * @example 1
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The name of the document (could be file name or title).
   * @example "invoice.pdf"
   */
  @Column()
  name: string;

  /**
   * The file path where the document is stored.
   * @example "/documents/invoices/invoice.pdf"
   */
  @Column()
  path: string;

  /**
   * The date when the document was uploaded.
   * @example "2024-11-18"
   */
  @Column({ name: 'uploaded_at', type: 'date' })
  uploadedAt: Date;

  /**
   * The user associated with the document.
   * A many-to-one relationship indicating that a document is uploaded by a user.
   */
  @ManyToOne(() => User, (user) => user.documents)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
