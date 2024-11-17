import { Controller, Post, Req, Body, ForbiddenException, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { CookieInterceptor } from './interceptor/cookie.interceptor';
import { User } from 'src/modules/users/entities/user.entity';

@UseInterceptors(CookieInterceptor)
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    const user = await this.authService.register(registerUserDto);
    console.log(user);
    return user;
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    //const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token not provided.');
    }

    try {
      const tokens = await this.authService.refreshToken(refreshToken);
      return tokens;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  //@UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    return await this.authService.logout(req.user);
  }
}
