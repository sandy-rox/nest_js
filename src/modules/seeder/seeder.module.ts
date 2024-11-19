import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service'; // Service to handle database seeding
import { SeederCommand } from './seeder.command'; // Command to trigger seeding from CLI
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../users/entities/role.entity'; // Role entity for seeding
import { User } from '../users/entities/user.entity'; // User entity for seeding

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User]), // Import Role and User repositories for seeding
  ],
  providers: [
    SeederService, // Service that contains seeding logic
    SeederCommand, // CLI command to execute the seeding process
  ],
})
export class SeederModule {
  // This module provides functionality to seed the database with initial data
  // for 'User' and 'Role' entities when the seed command is executed.
}
