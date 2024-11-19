import { User } from '../entities/user.entity'; // Import the User entity

// Define a type that represents a subset of the User entity, excluding certain fields.
export type UserResponse = Omit<User, 'created_at' | 'updated_at' | 'password'>;
