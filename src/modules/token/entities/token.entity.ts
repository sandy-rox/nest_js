import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Import the User entity for relationship

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number; // Primary key for the Token entity

  @Column({ name: 'refresh_token' })
  refreshToken: string; // The refresh token associated with the user

  @Column({ name: 'refresh_token_expires_at' })
  refreshTokenExpiresAt: Date; // Expiry date of the refresh token

  // Establish a one-to-one relationship with the User entity
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' }) // Marks the foreign key column for the User entity
  user: User; // The user to whom this token belongs
}
