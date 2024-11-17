import { User } from '../entities/user.entity';

export type UserResponse = Omit<User, 'created_at' | 'updated_at' | 'password'>;
