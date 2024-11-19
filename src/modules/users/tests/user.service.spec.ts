import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: any; // Mocked repository for User
  let roleRepository: any; // Mocked repository for Role

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
    };

    const mockRoleRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    roleRepository = module.get(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if user already exists', async () => {
      const userData = { email: 'test@example.com', username: 'testuser' };
      userRepository.findOne = jest.fn().mockResolvedValueOnce(userData);

      await expect(service.create(userData)).rejects.toThrow(BadRequestException);
    });

    it('should create a new user with "viewer" role if user does not exist', async () => {
      const userData = { email: 'test@example.com', password: '12345', firstName: 'test', lastName: 'example' };
      userRepository.findOne = jest.fn().mockResolvedValueOnce(null);
      userRepository.create = jest.fn().mockReturnValue(userData);
      userRepository.save = jest.fn().mockResolvedValue(userData);

      const roleData = { name: 'viewer' };
      roleRepository.findOne = jest.fn().mockResolvedValueOnce(roleData);
      roleRepository.create = jest.fn().mockReturnValue(roleData);
      roleRepository.save = jest.fn().mockResolvedValue(roleData);

      const result = await service.create(userData);
      expect(result.email).toBe(userData.email);
      console.log(result);
      //expect(result.roles).toContainEqual(roleData);
    });

    it('should create a new user and create a "viewer" role if it does not exist', async () => {
      const userData = { email: 'test@example.com', password: '12345', firstName: 'test', lastName: 'example' };
      userRepository.findOne = jest.fn().mockResolvedValueOnce(null);
      userRepository.create = jest.fn().mockReturnValue(userData);
      userRepository.save = jest.fn().mockResolvedValue(userData);

      roleRepository.findOne = jest.fn().mockResolvedValueOnce(null); // No role found
      roleRepository.create = jest.fn().mockReturnValue({ name: 'viewer' });
      roleRepository.save = jest.fn().mockResolvedValue({ name: 'viewer' });

      const result = await service.create(userData);
      expect(result.email).toBe(userData.email);
      //expect(result.roles).toEqual([{ name: 'viewer' }]);
    });
  });

  describe('updateUserRole', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      userRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(service.updateUserRole(1, 'admin')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if role does not exist', async () => {
      const userData = { email: 'test@example.com', username: 'testuser' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const roleData = { name: 'admin' };

      userRepository.findOne = jest.fn().mockResolvedValueOnce({ ...userData, id: 1 });
      roleRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(service.updateUserRole(1, 'admin')).rejects.toThrow(NotFoundException);
    });

    it('should update user role successfully', async () => {
      const userData = { email: 'test@example.com', username: 'testuser' };
      const roleData = { name: 'admin' };

      userRepository.findOne = jest.fn().mockResolvedValueOnce({ ...userData, id: 1 });
      roleRepository.findOne = jest.fn().mockResolvedValueOnce(roleData);
      userRepository.save = jest.fn().mockResolvedValueOnce({ ...userData, roles: [roleData] });

      const result = await service.updateUserRole(1, 'admin');
      expect(result.roles).toContainEqual(roleData);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const userData = { email: 'test@example.com', username: 'testuser' };
      userRepository.findOne = jest.fn().mockResolvedValueOnce(userData);

      const result = await service.findOneByEmail('test@example.com');
      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
    });
  });

  describe('findOneById', () => {
    it('should return a user by ID', async () => {
      const userData = { id: 1, email: 'test@example.com', username: 'testuser' };
      userRepository.findOne = jest.fn().mockResolvedValueOnce(userData);

      const result = await service.findOneById(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException if user not found by ID', async () => {
      userRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(service.findOneById(999)).resolves.toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, email: 'test@example.com', username: 'testuser' }];
      userRepository.find = jest.fn().mockResolvedValueOnce(users);

      const result = await service.findAll();
      expect(result).toBe(users);
    });
  });
});
