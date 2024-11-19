import { Controller, Post, Req, Body, ForbiddenException, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { CookieInterceptor } from './interceptor/cookie.interceptor';
import { User } from '../users/entities/user.entity';

/**
 * Controller for handling authentication-related operations.
 */
@UseInterceptors(CookieInterceptor)
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user.
   * @param {RegisterUserDto} registerUserDto - The user data for registration.
   * @returns {User} - The newly created user.
   */
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    const user = await this.authService.register(registerUserDto);
    console.log(user);
    return user;
  }

  /**
   * Logs in a user and returns authentication tokens.
   * @param {LoginUserDto} loginUserDto - The user login credentials.
   * @returns {Object} - The authentication tokens.
   */
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  /**
   * Refreshes the authentication token using a refresh token.
   * @param {string} refreshToken - The refresh token for reauthentication.
   * @returns {Object} - The new authentication tokens.
   * @throws {ForbiddenException} - If no refresh token is provided or if the token is invalid.
   */
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

  /**
   * Logs out the user by invalidating the session.
   * @param {Request} req - The request object containing the authenticated user.
   * @returns {void} - Logs out the user.
   */
  @Post('logout')
  async logout(@Req() req) {
    return await this.authService.logout(req.user);
  }
}
