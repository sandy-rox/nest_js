import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity'; // User entity for seeding
import { Repository } from 'typeorm';
import { Role } from '../users/entities/role.entity'; // Role entity for seeding

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // User repository for database operations
    @InjectRepository(Role)
    private roleRepository: Repository<Role>, // Role repository for database operations
  ) {}

  // This method seeds the database with default roles and an admin user.
  async seed() {
    // Step 1: Seed roles (admin, editor, viewer)
    const roles = ['admin', 'editor', 'viewer'];
    for (const roleName of roles) {
      const existingRole = await this.roleRepository.findOne({ where: { name: roleName } });
      if (!existingRole) {
        const role = new Role();
        role.name = roleName;
        await this.roleRepository.save(role);
        console.log(`Role "${roleName}" seeded successfully.`); // Log role creation
      } else {
        console.log(`Role "${roleName}" already exists.`); // Log if the role already exists
      }
    }

    // Step 2: Create admin user (with the 'admin' role)
    const adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } });
    if (adminRole) {
      const existingAdminUser = await this.userRepository.findOne({ where: { email: 'admin@example.com' } });

      if (!existingAdminUser) {
        const hashedPassword = await bcrypt.hash('adminpassword123', 12); // Hash the admin password
        const adminUser = new User();
        adminUser.email = 'admin@example.com';
        adminUser.password = hashedPassword;
        adminUser.firstName = 'Admin';
        adminUser.lastName = 'User';
        adminUser.roles = [adminRole]; // Assign the 'admin' role to the user

        await this.userRepository.save(adminUser);
        console.log('Admin user created successfully.'); // Log admin user creation
      } else {
        console.log('Admin user already exists.'); // Log if admin user exists
      }
    } else {
      console.log('Admin role not found, skipping admin user creation.'); // Log if admin role is missing
    }
  }
}
