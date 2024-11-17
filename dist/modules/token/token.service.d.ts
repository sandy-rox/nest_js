import { Token } from './entities/token.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AccessTokenPayload, RefreshTokenPayload } from 'src/modules/auth/type/jwtPayload';
import { UserService } from 'src/modules/users/users.service';
export declare class TokenService {
    private readonly tokenRepository;
    private readonly userService;
    constructor(tokenRepository: Repository<Token>, userService: UserService);
    saveTokens(user: Partial<User>, refreshToken: string, refreshTokenExpiresAt: Date): Promise<void>;
    deleteTokensByUserId(user: Partial<User>): Promise<void>;
    findRefreshToken(refreshToken: string): Promise<Token | undefined>;
    deleteExpiredTokens(): Promise<void>;
    createAccessToken({ userId, roles }: AccessTokenPayload): string;
    createRefreshToken({ userId }: RefreshTokenPayload): string;
    generateTokens(user: Partial<User>): Promise<any>;
    refreshToken(refreshToken: string): Promise<any>;
}
