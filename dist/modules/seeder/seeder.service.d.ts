import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/modules/users/entities/role.entity';
export declare class SeederService {
    private readonly userRepository;
    private roleRepository;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>);
    seed(): Promise<void>;
}
