import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity'; // Token entity for refresh token data
import { TokenService } from './token.service'; // Service for handling token-related logic
import { UserService } from '../users/users.service'; // Service for handling user-related logic
import { User } from '../users/entities/user.entity'; // User entity for user information
import { Role } from '../users/entities/role.entity'; // Role entity for user roles

@Module({
  imports: [TypeOrmModule.forFeature([Token, User, Role])], // Register Token, User, and Role entities with TypeORM
  providers: [TokenService, UserService], // Provide TokenService and UserService for dependency injection
  exports: [TokenService], // Export TokenService so it can be used in other modules
})
export class TokenModule {}
