/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { TokenService } from '../token/token.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { User } from '../users/entities/user.entity';
import { Token } from '../token/entities/token.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;
  let userService: jest.Mocked<UserService>;
  let tokenService: jest.Mocked<TokenService>;

  // Create mock services
  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
  };

  const mockUserService = {
    create: jest.fn(),
    findOneByEmail: jest.fn(),
    findOneById: jest.fn(),
  };

  const mockTokenService = {
    saveTokens: jest.fn(),
    deleteTokensByUserId: jest.fn(),
    generateTokens: jest.fn(),
    refreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    // Explicitly cast services to jest.Mocked<T>
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService) as jest.Mocked<AuthService>;
    userService = module.get<UserService>(UserService) as jest.Mocked<UserService>;
    tokenService = module.get<TokenService>(TokenService) as jest.Mocked<TokenService>;
  });

  it('should register a user successfully', async () => {
    const registerUserDto: RegisterUserDto = {
      email: 'test@test.com',
      password: 'password',
      firstName: 'test',
      lastName: 'test',
    };
    const mockUser: User = {
      ...registerUserDto,
      id: 1,
      password: 'hashedPassword',
      roles: [],
      createdAt: undefined,
      updatedAt: undefined,
      token: new Token(), // Make sure Token is correctly imported and instantiated
      documents: [],
    };

    // Mock the resolved value of register function
    authService.register.mockResolvedValue(mockUser);

    const result = await authController.register(registerUserDto);

    expect(result).toEqual(mockUser);
    expect(authService.register).toHaveBeenCalledWith(registerUserDto);
  });

  it('should login a user successfully', async () => {
    const loginUserDto: LoginUserDto = { email: 'test@test.com', password: 'password' };
    const mockTokens = { accessToken: 'accessToken', refreshToken: 'refreshToken' };

    // Mock the resolved value of login function
    authService.login.mockResolvedValue(mockTokens);

    const result = await authController.login(loginUserDto);

    expect(result).toEqual(mockTokens);
    expect(authService.login).toHaveBeenCalledWith(loginUserDto);
  });

  it('should refresh token successfully', async () => {
    const refreshToken = 'validRefreshToken';
    const mockTokens = { accessToken: 'newAccessToken', refreshToken: 'newRefreshToken' };

    // Mock the resolved value of refreshToken function
    authService.refreshToken.mockResolvedValue(mockTokens);

    const result = await authController.refreshToken(refreshToken);

    expect(result).toEqual(mockTokens);
    expect(authService.refreshToken).toHaveBeenCalledWith(refreshToken);
  });

  it('should throw error if refresh token is invalid', async () => {
    const refreshToken = 'invalidRefreshToken';

    // Mock the rejected value of refreshToken function
    authService.refreshToken.mockRejectedValue(new Error('Invalid refresh token'));

    try {
      await authController.refreshToken(refreshToken);
    } catch (e) {
      expect(e.message).toBe('Invalid refresh token');
    }

    expect(authService.refreshToken).toHaveBeenCalledWith(refreshToken);
  });

  it('should logout a user successfully', async () => {
    const mockUser = { id: 1, email: 'test@test.com' }; // Example mock user
    authService.logout.mockResolvedValue(undefined);

    await authController.logout({ user: mockUser });

    expect(authService.logout).toHaveBeenCalledWith(mockUser);
  });
});
