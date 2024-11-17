import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Import the User entity

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'refresh_token_expires_at' })
  refreshTokenExpiresAt: Date;

  // Establish a one-to-one relationship with User
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' }) // Marks the foreign key column
  user: User;
}
