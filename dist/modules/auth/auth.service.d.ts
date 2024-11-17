import { UserService } from '../users/users.service';
import { TokenService } from '../token/token.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { RegisterUserDto } from './dto/registerUser.dto';
import { User } from 'src/modules/users/entities/user.entity';
export declare class AuthService {
    private readonly userService;
    private readonly tokenService;
    constructor(userService: UserService, tokenService: TokenService);
    register(registerUserDto: RegisterUserDto): Promise<User>;
    login(loginUserDto: LoginUserDto): Promise<any>;
    refreshToken(refreshToken: string): Promise<any>;
    logout(userId: number): Promise<void>;
}
