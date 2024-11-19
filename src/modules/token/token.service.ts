import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity'; // Token entity to store tokens in DB
import { User } from '../users/entities/user.entity'; // User entity to manage user data
import { Repository } from 'typeorm'; // TypeORM repository to interact with database
import { AccessTokenPayload, RefreshTokenPayload } from '../auth/type/jwtPayload'; // Payload types for JWT tokens
import { JwtPayload, sign, verify } from 'jsonwebtoken'; // Methods for signing and verifying JWT tokens
import { UserService } from '../users/users.service'; // Service to interact with user data

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>, // Inject Token repository
    private readonly userService: UserService, // Inject User service to fetch user data
  ) {}

  // Save Access and Refresh tokens in the database
  async saveTokens(user: Partial<User>, refreshToken: string, refreshTokenExpiresAt: Date): Promise<void> {
    const token = this.tokenRepository.create({
      user,
      refreshToken,
      refreshTokenExpiresAt,
    });
    await this.tokenRepository.save(token); // Persist token in DB
  }

  // Delete tokens associated with a user by their userId
  async deleteTokensByUserId(user: Partial<User>): Promise<void> {
    await this.tokenRepository.delete({ user: { id: user.id } });
  }

  // Find a refresh token in the database and check its validity
  async findRefreshToken(refreshToken: string): Promise<Token | undefined> {
    const token = await this.tokenRepository.findOne({
      where: { refreshToken },
    });

    if (!token) return undefined; // Token not found

    // Check if the refresh token has expired
    const currentTime = new Date();
    if (token.refreshTokenExpiresAt < currentTime) {
      await this.tokenRepository.delete({ refreshToken }); // Delete expired token
      return undefined;
    }

    return token;
  }

  // Delete expired tokens periodically
  async deleteExpiredTokens(): Promise<void> {
    await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .where('refreshTokenExpiresAt <= :now', { now: new Date() })
      .execute(); // Delete expired tokens from DB
  }

  // Generate Access Token using JWT
  createAccessToken({ userId, roles }: AccessTokenPayload): string {
    return sign({ userId, roles }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m', // Access token expires in 15 minutes
    });
  }

  // Generate Refresh Token using JWT
  createRefreshToken({ userId }: RefreshTokenPayload): string {
    return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d', // Refresh token expires in 7 days
    });
  }

  // Generate both Access and Refresh tokens and store them in DB
  async generateTokens(user: Partial<User>): Promise<any> {
    const { id: userId, roles } = user;
    const accessToken = this.createAccessToken({ userId, roles });
    const refreshToken = this.createRefreshToken({ userId });
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Set expiry for refresh token (7 days)
    await this.deleteTokensByUserId(user); // Delete old tokens before saving new ones
    await this.saveTokens(user, refreshToken, refreshTokenExpiresAt); // Save new tokens in DB
    return { accessToken, refreshToken }; // Return generated tokens
  }

  // Refresh tokens (Access and Refresh) using valid refresh token
  async refreshToken(refreshToken: string): Promise<any> {
    let decodedToken: JwtPayload;

    try {
      decodedToken = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as JwtPayload; // Verify the refresh token
    } catch (error) {
      console.log(error);
      throw new Error('Invalid refresh token.'); // Token verification failed
    }

    if (typeof decodedToken === 'object' && 'userId' in decodedToken) {
      const user = await this.userService.findOneById(decodedToken.userId); // Fetch user by ID

      if (!user) {
        throw new NotFoundException('User not found.'); // User not found
      }

      const activeToken = await this.findRefreshToken(refreshToken); // Check if refresh token exists and is valid
      if (!activeToken) {
        throw new Error('Refresh token is no longer valid.'); // Token is no longer valid
      }

      const { id: userId, roles } = user;
      const accessToken = this.createAccessToken({ userId, roles }); // Generate new access token

      return { accessToken, refreshToken }; // Return new tokens
    } else {
      throw new Error('Invalid refresh token structure.'); // Invalid token structure
    }
  }
}
