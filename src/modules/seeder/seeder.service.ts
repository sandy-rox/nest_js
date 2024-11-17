import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/modules/users/entities/role.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  // This method will handle seeding the database
  async seed() {
    // Step 1: Seed roles
    const roles = ['admin', 'editor', 'viewer'];
    for (const roleName of roles) {
      const existingRole = await this.roleRepository.findOne({ where: { name: roleName } });
      if (!existingRole) {
        const role = new Role();
        role.name = roleName;
        await this.roleRepository.save(role);
        console.log(`Role "${roleName}" seeded successfully.`);
      } else {
        console.log(`Role "${roleName}" already exists.`);
      }
    }

    // Step 2: Create admin user
    const adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } });
    if (adminRole) {
      const existingAdminUser = await this.userRepository.findOne({ where: { email: 'admin@example.com' } });

      if (!existingAdminUser) {
        const hashedPassword = await bcrypt.hash('adminpassword123', 12); // Hash the password
        const adminUser = new User();
        adminUser.email = 'admin@example.com';
        adminUser.password = hashedPassword;
        adminUser.firstName = 'Admin';
        adminUser.lastName = 'User';
        adminUser.roles = [adminRole]; // Assign the 'admin' role

        await this.userRepository.save(adminUser);
        console.log('Admin user created successfully.');
      } else {
        console.log('Admin user already exists.');
      }
    } else {
      console.log('Admin role not found, skipping admin user creation.');
    }
  }
}
