import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { UserResponse } from './type/userResponse';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<Partial<User>[]>;
    findUserById(userId: string): Promise<UserResponse>;
    updateUserRole(userId: number, roleName: string): Promise<User>;
}
