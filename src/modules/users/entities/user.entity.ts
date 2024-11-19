import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm'; // Import decorators and types from TypeORM
import { Token } from '../../token/entities/token.entity'; // Import the Token entity for relationship
import { Document } from '../../document/entities/document.entity'; // Import the Document entity for relationship
import { Role } from './role.entity'; // Import the Role entity for the many-to-many relationship

@Entity({ name: 'user' }) // Marks this class as a 'user' entity in the database
export class User {
  @PrimaryGeneratedColumn() // Automatically generates a primary key for the user
  id: number;

  @Column({ name: 'first_name', nullable: false }) // Ensures first name is required (non-nullable)
  firstName: string;

  @Column({ name: 'last_name', nullable: false }) // Ensures last name is required (non-nullable)
  lastName: string;

  @Column({ unique: true, length: 255, nullable: false }) // Ensures email is unique and required (non-nullable)
  email: string;

  @ManyToMany(() => Role, (role) => role.users, { nullable: false }) // Many-to-many relationship with Role entity
  @JoinTable() // Creates a join table for the many-to-many relationship
  roles: Role[];

  @CreateDateColumn({ name: 'created_at', nullable: false }) // Automatically sets the creation timestamp, non-nullable
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', nullable: false }) // Automatically sets the updated timestamp, non-nullable
  updatedAt: Date;

  @Column({ nullable: false }) // Ensures password is required (non-nullable)
  password: string;

  // Establishes a one-to-one relationship with the Token entity
  @OneToOne(() => Token, (token) => token.user, { nullable: true }) // Token can be nullable (optional relationship)
  token: Token;

  // Establishes a one-to-many relationship with the Document entity
  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];
}
