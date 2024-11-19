import * as bcrypt from 'bcryptjs';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { TokenService } from '../token/token.service'; // Inject the TokenService
import { LoginUserDto } from './dto/loginUser.dto';
import { RegisterUserDto } from './dto/registerUser.dto';
import { User } from '../users/entities/user.entity';

/**
 * Service for handling authentication-related operations.
 * It includes user registration, login, token generation, and logout functionalities.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService, // Inject TokenService for managing tokens
  ) {}

  /**
   * Registers a new user by hashing the password and saving the user in the database.
   * @param {RegisterUserDto} registerUserDto - The user data for registration.
   * @returns {Promise<User>} - The created user object.
   */
  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 12);
    const user = await this.userService.create({
      ...registerUserDto,
      password: hashedPassword,
    });
    return user;
  }

  /**
   * Logs in a user by verifying their credentials and generating access tokens.
   * @param {LoginUserDto} loginUserDto - The user login credentials.
   * @returns {Promise<any>} - The generated authentication tokens (access and refresh tokens).
   * @throws {ForbiddenException} - If invalid credentials are provided.
   */
  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userService.findOneByEmail(loginUserDto.email);
    console.log(user);
    if (!user || !(await bcrypt.compare(loginUserDto.password, user.password))) {
      throw new ForbiddenException('Invalid username or password');
    }
    const tokens = await this.tokenService.generateTokens(user);
    return tokens;
  }

  /**
   * Refreshes the authentication token using a valid refresh token.
   * @param {string} refreshToken - The refresh token for generating a new access token.
   * @returns {Promise<any>} - The new authentication tokens.
   */
  async refreshToken(refreshToken: string): Promise<any> {
    const tokens = await this.tokenService.refreshToken(refreshToken);
    return tokens;
  }

  /**
   * Logs out the user by deleting their associated tokens.
   * @param {number} userId - The ID of the user to log out.
   * @returns {Promise<void>} - Void when logout is successful.
   * @throws {NotFoundException} - If the user is not found.
   */
  async logout(userId: number): Promise<void> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    await this.tokenService.deleteTokensByUserId(user);
  }
}
