import { Module } from '@nestjs/common'; // Import necessary decorators
import { UserController } from './users.controller'; // Import the UserController to handle HTTP requests
import { UserService } from './users.service'; // Import the UserService to interact with the database
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule to integrate TypeORM
import { User } from './entities/user.entity'; // Import the User entity to interact with the user table
import { Role } from './entities/role.entity'; // Import the Role entity to interact with the role table

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])], // Register User and Role entities with TypeORM for repository injection
  providers: [UserService], // Register UserService as a provider to handle business logic
  controllers: [UserController], // Register UserController to handle user-related HTTP routes
  exports: [UserService], // Export UserService to make it available for use in other modules
})
export class UserModule {}
