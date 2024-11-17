import { Role } from 'src/modules/users/entities/role.entity';
export interface AccessTokenPayload {
    userId: number;
    roles: Role[];
}
export interface RefreshTokenPayload {
    userId: number;
}
