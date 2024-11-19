import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../users/users.module';
import { TokenService } from '../token/token.service';
import { UserService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../token/entities/token.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';

/**
 * Module responsible for authentication operations including login, registration, token management, and user session.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Token, User, Role]), // Importing relevant entities for TypeORM.
    UserModule, // Importing the UserModule for user-related operations.
    TokenModule, // Importing the TokenModule for token-related operations.
  ],
  providers: [AuthService, TokenService, UserService], // Registering services for handling business logic.
  controllers: [AuthController], // Defining the AuthController to handle API endpoints.
  exports: [AuthService, TokenService, UserService], // Exporting services for use in other modules.
})
export class AuthModule {}
