import { User } from './user.entity';
export declare enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    VIEWER = "viewer"
}
export declare class Role {
    id: number;
    name: string;
    users: User[];
}
