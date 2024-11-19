import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm'; // Import necessary decorators and types from TypeORM
import { User } from './user.entity'; // Import the User entity to establish relationship

// Enum to define possible user roles
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

@Entity() // Marks this class as a database entity
export class Role {
  @PrimaryGeneratedColumn() // Automatically generates a primary key for the Role entity
  id: number;

  @Column({ unique: true }) // Ensures that the role name is unique
  name: string;

  // Many-to-many relationship with User entity, each role can be assigned to many users
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
