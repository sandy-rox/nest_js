import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    // Check if a user with the same email already exists
    const existingUser = await this.findOneByEmail(userData.email);
    console.log(existingUser);
    if (existingUser) {
      throw new BadRequestException('User already exists.');
    }

    try {
      // Ensure 'viewer' role exists
      let viewerRole = await this.roleRepository.findOne({ where: { name: 'viewer' } });

      if (!viewerRole) {
        viewerRole = this.roleRepository.create({ name: 'viewer' });
        await this.roleRepository.save(viewerRole);
      }

      const user = this.userRepository.create({
        ...userData,
        roles: [viewerRole], // Assigning default 'viewer' role
      });
      console.log(user);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to register user.');
    }
  }

  async updateUserRole(userId: number, roleName: string): Promise<User> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      // Optionally create a role if it doesn't exist
      // role = this.roleRepository.create({ name: roleName });
      // await this.roleRepository.save(role);
      throw new NotFoundException('Role not found.');
    }

    user.roles = [role]; // Optionally allow multiple roles
    return this.userRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    console.log(user);
    return user;
  }

  async findOneById(userId: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'], // Include the related 'roles' information
    });
  }

  async findAll(): Promise<User[] | null> {
    return await this.userRepository.find();
  }
}
