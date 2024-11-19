import { JwtPayload, verify } from 'jsonwebtoken';
import { NestMiddleware, Injectable, ForbiddenException } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../../users/users.service';

/**
 * Middleware to authenticate incoming requests by verifying the JWT access token.
 *
 * This middleware:
 * 1. Reads the Authorization header from the request.
 * 2. Verifies the access token.
 * 3. If valid, retrieves the user object and attaches it to the request object.
 * 4. If invalid, throws a `ForbiddenException` to signal authentication failure.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  /**
   * Initializes the AuthMiddleware with the UserService for accessing user data.
   *
   * @param {UserService} userService - The service used to fetch user details by ID.
   */
  constructor(private readonly userService: UserService) {}

  /**
   * The main method that executes the authentication logic for each incoming request.
   * It checks for the `Authorization` header, verifies the JWT, and attaches the user
   * object to the request if valid.
   *
   * @param {Request} req - The incoming HTTP request.
   * @param {Response} res - The outgoing HTTP response.
   * @param {NextFunction} next - The next middleware to call if the authentication is successful.
   *
   * @returns {void} - Continues the request-response cycle if the user is authenticated.
   *
   * @throws {ForbiddenException} - If the token is missing or invalid.
   */
  async use(req: Request | any, res: Response, next: () => void) {
    const bearerHeader = req.headers.authorization; // Read the authorization header
    console.log('token:', bearerHeader);

    // Extract the access token from the "Bearer <token>" format
    const accessToken = bearerHeader && bearerHeader.split(' ')[1];
    let user;

    // If no token is provided, skip the authentication check
    if (!bearerHeader || !accessToken) {
      return next();
    }

    try {
      // Decode and verify the access token using the secret key
      const { userId: id } = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as JwtPayload;
      // Fetch user details using the extracted user ID
      user = await this.userService.findOneById(id);
      console.log(user);
    } catch (error) {
      console.log(error);
      // Throw a ForbiddenException if the token is invalid
      throw new ForbiddenException('Please register or sign in.');
    }

    // If the user is valid, attach the user object to the request
    if (user) {
      req.user = user;
    }
    // Call the next middleware or route handler
    next();
  }
}
