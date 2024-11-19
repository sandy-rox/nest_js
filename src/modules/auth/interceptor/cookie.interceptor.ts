import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interceptor to manage the setting of a `refreshToken` in an HTTP-only cookie while
 * removing it from the response payload. This provides added security and clean handling
 * of refresh tokens.
 */
@Injectable()
export class CookieInterceptor implements NestInterceptor {
  /**
   * Intercepts the request-response cycle and modifies the response by setting a
   * `refreshToken` in a secure HTTP-only cookie, then removing it from the response body.
   *
   * @param {ExecutionContext} context - The current execution context representing the request.
   * @param {CallHandler} next - The next handler to pass control to.
   * @returns {Observable<any>} - An observable of the modified response.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Extract the HTTP response object from the context
        const res = context.switchToHttp().getResponse();

        // Destructure accessToken and refreshToken from the response data
        const { accessToken, refreshToken } = data;

        // Set the refreshToken as an HTTP-only cookie with a 7-day expiration period
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
          maxAge: 1000 * 60 * 60 * 24 * 7, // Set to expire in 7 days (in milliseconds)
          path: '/api/v1/auth/refresh-token', // The cookie is only sent to this endpoint
        });

        // Return the modified response data with the refreshToken removed
        return { accessToken };
      }),
    );
  }
}
