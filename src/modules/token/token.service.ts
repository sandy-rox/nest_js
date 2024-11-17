import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AccessTokenPayload, RefreshTokenPayload } from 'src/modules/auth/type/jwtPayload';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { UserService } from 'src/modules/users/users.service';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly userService: UserService,
  ) {}

  // Add access and refresh tokens
  async saveTokens(user: Partial<User>, refreshToken: string, refreshTokenExpiresAt: Date): Promise<void> {
    const token = this.tokenRepository.create({
      user,
      refreshToken,
      refreshTokenExpiresAt,
    });
    await this.tokenRepository.save(token);
  }

  // Delete tokens by userId
  async deleteTokensByUserId(user: Partial<User>): Promise<void> {
    await this.tokenRepository.delete({ user: { id: user.id } });
  }

  async findRefreshToken(refreshToken: string): Promise<Token | undefined> {
    // Find the token by refreshToken
    const token = await this.tokenRepository.findOne({
      where: { refreshToken },
    });

    // If no token is found, return undefined
    if (!token) {
      return undefined;
    }

    // Check if the token has expired (Assuming `expiresAt` is the expiration field)
    const currentTime = new Date();
    if (token.refreshTokenExpiresAt < currentTime) {
      // If expired, delete the token
      await this.tokenRepository.delete({ refreshToken });
      return undefined;
    }

    return token;
  }

  // Delete expired tokens periodically (optional)
  async deleteExpiredTokens(): Promise<void> {
    await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .where('refreshTokenExpiresAt <= :now', {
        now: new Date(),
      })
      .execute();
  }

  // Generate Access Token
  createAccessToken({ userId, roles }: AccessTokenPayload): string {
    return sign({ userId, roles }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
  }

  // Generate Refresh Token
  createRefreshToken({ userId }: RefreshTokenPayload): string {
    return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });
  }

  // Generate both Access and Refresh Tokens
  async generateTokens(user: Partial<User>): Promise<any> {
    const { id: userId, roles } = user;
    const accessToken = this.createAccessToken({ userId, roles });
    const refreshToken = this.createRefreshToken({ userId });
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.deleteTokensByUserId(user);
    await this.saveTokens(user, refreshToken, refreshTokenExpiresAt);
    return { accessToken, refreshToken };
  }

  // Refresh Tokens (Access and Refresh) using Refresh Token
  async refreshToken(refreshToken: string): Promise<any> {
    let decodedToken: JwtPayload;

    try {
      decodedToken = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as JwtPayload;
    } catch (error) {
      console.log(error);
      throw new Error('Invalid refresh token.');
    }

    if (typeof decodedToken === 'object' && 'userId' in decodedToken) {
      const user = await this.userService.findOneById(decodedToken.userId);

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      // Check if the refresh token exists in the database and is valid
      const activeToken = await this.findRefreshToken(refreshToken);
      if (!activeToken) {
        throw new Error('Refresh token is no longer valid.');
      }

      const { id: userId, roles } = user;
      const accessToken = this.createAccessToken({ userId, roles });

      return { accessToken, refreshToken };
    } else {
      throw new Error('Invalid refresh token structure.');
    }
  }
}
