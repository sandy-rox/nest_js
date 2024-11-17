import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Token } from '../../token/entities/token.entity';
import { Document } from '../../document/entities/document.entity';
import { Role } from './role.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', nullable: false }) // Ensure first name is not null
  firstName: string;

  @Column({ name: 'last_name', nullable: false }) // Ensure last name is not null
  lastName: string;

  @Column({ unique: true, length: 255, nullable: false }) // Ensure email is not null and unique
  email: string;

  @ManyToMany(() => Role, (role) => role.users, { nullable: false })
  @JoinTable()
  roles: Role[];

  @CreateDateColumn({ name: 'created_at', nullable: false }) // Ensure createdAt is not null
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', nullable: false }) // Ensure updatedAt is not null
  updatedAt: Date;

  @Column({ nullable: false }) // Ensure password is not null
  password: string;

  // Establish a one-to-one relationship with Token
  @OneToOne(() => Token, (token) => token.user, { nullable: true }) // Token can be nullable
  token: Token;

  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];
}
