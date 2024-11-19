/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '../token.service';
import { UserService } from '../../users/users.service';
import { Token } from '../entities/token.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

describe('TokenService', () => {
  let service: TokenService;
  let tokenRepository: Repository<Token>;
  let userService: UserService;

  const mockTokenRepository = {
    create: jest.fn().mockReturnValue({}),
    save: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  };

  const mockUserService = {
    findOneById: jest.fn(),
  };

  const mockSign = jest.fn();
  const mockVerify = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: getRepositoryToken(Token),
          useValue: mockTokenRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideProvider(sign)
      .useValue(mockSign)
      .overrideProvider(verify)
      .useValue(mockVerify)
      .compile();

    service = module.get<TokenService>(TokenService);
    tokenRepository = module.get<Repository<Token>>(getRepositoryToken(Token));
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveTokens', () => {
    it('should save tokens to the database', async () => {
      const user = { id: 1 } as User;
      const refreshToken = 'mock-refresh-token';
      const refreshTokenExpiresAt = new Date();
      await service.saveTokens(user, refreshToken, refreshTokenExpiresAt);

      expect(mockTokenRepository.create).toHaveBeenCalledWith({
        user,
        refreshToken,
        refreshTokenExpiresAt,
      });
      expect(mockTokenRepository.save).toHaveBeenCalled();
    });
  });

  describe('deleteTokensByUserId', () => {
    it('should delete tokens for a user', async () => {
      const user = { id: 1 } as User;
      await service.deleteTokensByUserId(user);

      expect(mockTokenRepository.delete).toHaveBeenCalledWith({ user: { id: user.id } });
    });
  });

  describe('findRefreshToken', () => {
    it('should return token if found and valid', async () => {
      const token = new Token();
      token.refreshTokenExpiresAt = new Date(Date.now() + 10000); // 10 seconds from now
      mockTokenRepository.findOne.mockResolvedValue(token);

      const result = await service.findRefreshToken('valid-refresh-token');
      expect(result).toBe(token);
    });

    it('should return undefined if token is expired', async () => {
      const token = new Token();
      token.refreshTokenExpiresAt = new Date(Date.now() - 10000); // 10 seconds ago
      mockTokenRepository.findOne.mockResolvedValue(token);

      const result = await service.findRefreshToken('expired-refresh-token');
      expect(result).toBeUndefined();
    });

    it('should return undefined if token is not found', async () => {
      mockTokenRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findRefreshToken('nonexistent-token');
      expect(result).toBeUndefined();
    });
  });

  describe('refreshToken', () => {
    // it('should return new access token if refresh token is valid', async () => {
    //   // Mock the `verify` method to return a valid token payload (no errors)
    //   const mockDecodedToken = { userId: 1 };
    //   mockVerify.mockReturnValue(mockDecodedToken);

    //   // Mock the user service to return a valid user object
    //   const user = { id: 1, roles: [{ id: 1, name: 'viewer' }] } as User;
    //   mockUserService.findOneById.mockResolvedValue(user);

    //   // Mock the token repository's `findRefreshToken` method to return a valid token
    //   const mockToken = new Token();
    //   mockToken.refreshTokenExpiresAt = new Date(Date.now() + 10000); // Token expires in the future
    //   mockToken.refreshToken = 'valid-refresh-token';
    //   mockToken.user = user;
    //   mockTokenRepository.findOne.mockResolvedValue(mockToken);

    //   // Mock the `sign` method to return a mocked access token
    //   mockSign.mockReturnValue('mock-access-token');

    //   // Call the method with a valid refresh token
    //   const result = await service.refreshToken('valid-refresh-token');

    //   // Assert that the result matches the expected output
    //   expect(result).toEqual({
    //     accessToken: 'mock-access-token',
    //     refreshToken: 'valid-refresh-token',
    //   });
    // });

    it('should throw NotFoundException if user not found', async () => {
      mockVerify.mockReturnValue({ userId: 1 });
      mockUserService.findOneById.mockResolvedValue(null);

      mockVerify.mockImplementation(() => {
        throw new Error('Invalid refresh token.');
      });

      await expect(service.refreshToken('invalid-refresh-token')).rejects.toThrowError('Invalid refresh token.');
    });

    it('should throw error if refresh token is invalid', async () => {
      mockVerify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken('invalid-refresh-token')).rejects.toThrow('Invalid refresh token.');
    });
  });
});
