import * as bcrypt from 'bcryptjs';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { TokenService } from '../token/token.service'; // Inject the TokenService
import { LoginUserDto } from './dto/loginUser.dto';
import { RegisterUserDto } from './dto/registerUser.dto';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService, // Inject TokenService for managing tokens
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 12);
    const user = await this.userService.create({
      ...registerUserDto,
      password: hashedPassword,
    });
    return user;
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userService.findOneByEmail(loginUserDto.email);
    console.log(user);
    if (!user || !(await bcrypt.compare(loginUserDto.password, user.password))) {
      throw new ForbiddenException('Invalid username or password');
    }
    const tokens = await this.tokenService.generateTokens(user);
    return tokens;
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const tokens = await this.tokenService.refreshToken(refreshToken);
    return tokens;
  }

  async logout(userId: number): Promise<void> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    await this.tokenService.deleteTokensByUserId(user);
  }
}
