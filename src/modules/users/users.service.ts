import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Injecting the User repository
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>, // Injecting the Role repository
  ) {}

  // Create a new user
  async create(userData: Partial<User>): Promise<User> {
    // Check if a user with the same email already exists
    const existingUser = await this.findOneByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestException('User already exists.');
    }

    try {
      // Ensure the 'viewer' role exists or create it
      let viewerRole = await this.roleRepository.findOne({ where: { name: 'viewer' } });
      if (!viewerRole) {
        viewerRole = this.roleRepository.create({ name: 'viewer' });
        await this.roleRepository.save(viewerRole);
      }

      const user = this.userRepository.create({
        ...userData,
        roles: [viewerRole], // Assigning default 'viewer' role
      });
      await this.userRepository.save(user); // Save the user
      return user;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to register user.');
    }
  }

  // Update a user's role by userId
  async updateUserRole(userId: number, roleName: string): Promise<User> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    user.roles = [role]; // Optionally, you can assign multiple roles here
    return this.userRepository.save(user); // Save the updated user
  }

  // Find a user by email
  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email: email.toLowerCase() }, // Normalize email to lowercase
    });
  }

  // Find a user by ID
  async findOneById(userId: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'], // Include related roles information
    });
  }

  // Find all users
  async findAll(): Promise<User[] | null> {
    return await this.userRepository.find();
  }
}
