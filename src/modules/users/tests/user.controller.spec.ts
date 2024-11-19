/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../users.controller';
import { UserService } from '../users.service';
import { NotFoundException } from '@nestjs/common';
import { RolesGuard } from '../../auth/guard/role.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  // Mocking UserService
  const mockUserService = {
    findAll: jest.fn(),
    findOneById: jest.fn(),
    updateUserRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: RolesGuard,
          useValue: {}, // Mocking the RolesGuard
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('findAll', () => {
    it('should return an array of users without password', async () => {
      const result = [
        { id: 1, name: 'User 1', email: 'user1@example.com', password: 'hashedpassword' },
        { id: 2, name: 'User 2', email: 'user2@example.com', password: 'hashedpassword' },
      ];

      mockUserService.findAll.mockResolvedValue(result);

      const response = await userController.findAll();

      // Validate the response
      expect(response).toEqual([
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' },
      ]);
    });

    it('should throw NotFoundException if users cannot be fetched', async () => {
      mockUserService.findAll.mockRejectedValue(new Error('Error fetching users'));

      await expect(userController.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const result = { id: 1, name: 'User 1', email: 'user1@example.com' };
      mockUserService.findOneById.mockResolvedValue(result);

      const response = await userController.findUserById('1');
      expect(response).toEqual(result);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserService.findOneById.mockRejectedValue(new Error('User not found'));

      await expect(userController.findUserById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUserRole', () => {
    it('should update the user role', async () => {
      const userId = 1;
      const roleName = 'admin';
      const result = { id: userId, role: roleName };

      mockUserService.updateUserRole.mockResolvedValue(result);

      const response = await userController.updateUserRole(userId, roleName);

      expect(response).toEqual(result);
      expect(mockUserService.updateUserRole).toHaveBeenCalledWith(userId, roleName);
    });
  });
});
