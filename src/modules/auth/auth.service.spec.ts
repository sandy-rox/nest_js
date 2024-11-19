/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { TokenService } from '../token/token.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from './dto/registerUser.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let tokenService: TokenService;

  const mockUserService = {
    create: jest.fn(),
    findOneByEmail: jest.fn(),
    findOneById: jest.fn(),
  };

  const mockTokenService = {
    generateTokens: jest.fn(),
    refreshToken: jest.fn(),
    deleteTokensByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    tokenService = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user with hashed password', async () => {
      const registerUserDto = { email: 'test@test.com', password: 'password' } as RegisterUserDto;
      const hashedPassword = await bcrypt.hash(registerUserDto.password, 12);
      const mockUser = { email: registerUserDto.email, password: hashedPassword };

      // Mocking the create method of the user service to resolve with the mockUser
      mockUserService.create.mockResolvedValue(mockUser);

      // Calling the register method of the auth service
      const result = await authService.register(registerUserDto);

      // Assertions to verify that the result is correct
      expect(result).toHaveProperty('email', mockUser.email); // Check if email matches
      expect(result).toHaveProperty('password'); // Ensure password exists
      expect(result.password).not.toBe(registerUserDto.password); // Ensure password is hashed
      expect(mockUserService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerUserDto.email,
          password: expect.any(String), // Check that the password is a string (hashed)
        }),
      );
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const loginUserDto = { email: 'test@test.com', password: 'password' };
      const mockUser = { id: 1, email: 'test@test.com', password: await bcrypt.hash('password', 12) };
      const tokens = { accessToken: 'access_token', refreshToken: 'refresh_token' };

      mockUserService.findOneByEmail.mockResolvedValue(mockUser);
      mockTokenService.generateTokens.mockResolvedValue(tokens);

      const result = await authService.login(loginUserDto);
      expect(result).toEqual(tokens);
      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(loginUserDto.email);
      expect(mockTokenService.generateTokens).toHaveBeenCalledWith(mockUser);
    });

    it('should throw ForbiddenException for invalid credentials', async () => {
      const loginUserDto = { email: 'test@test.com', password: 'wrong_password' };
      const mockUser = { id: 1, email: 'test@test.com', password: await bcrypt.hash('password', 12) };

      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      await expect(authService.login(loginUserDto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens when refresh token is valid', async () => {
      const refreshToken = 'refresh_token';
      const newTokens = { accessToken: 'new_access_token', refreshToken: 'new_refresh_token' };

      mockTokenService.refreshToken.mockResolvedValue(newTokens);

      const result = await authService.refreshToken(refreshToken);
      expect(result).toEqual(newTokens);
      expect(mockTokenService.refreshToken).toHaveBeenCalledWith(refreshToken);
    });
  });

  describe('logout', () => {
    it('should log out the user successfully', async () => {
      const userId = 1;
      const mockUser = { id: 1, email: 'test@test.com' };

      mockUserService.findOneById.mockResolvedValue(mockUser);

      await authService.logout(userId);

      expect(mockUserService.findOneById).toHaveBeenCalledWith(userId);
      expect(mockTokenService.deleteTokensByUserId).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 1;

      mockUserService.findOneById.mockResolvedValue(null);

      await expect(authService.logout(userId)).rejects.toThrow(NotFoundException);
    });
  });
});
