import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
export declare class UserService {
    private readonly userRepository;
    private readonly roleRepository;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>);
    create(userData: Partial<User>): Promise<User>;
    updateUserRole(userId: number, roleName: string): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
    findOneById(userId: number): Promise<User>;
    findAll(): Promise<User[] | null>;
}
