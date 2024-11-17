import { User } from '../../users/entities/user.entity';
export declare class Token {
    id: number;
    refreshToken: string;
    refreshTokenExpiresAt: Date;
    user: User;
}
