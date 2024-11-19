import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for handling user login requests.
 * This class uses decorators from `class-validator` to enforce validation rules.
 * It ensures that the input data for login operations meets the required structure and constraints.
 */
export class LoginUserDto {
  /**
   * The email address of the user.
   * @example 'user@example.com'
   * @decorator `@IsEmail()` ensures the value is a valid email address.
   */
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  /**
   * The password of the user.
   * @example 'password123'
   * @decorator `@IsString()` ensures the value is a string.
   * @decorator `@MinLength(6)` enforces a minimum length of 6 characters.
   */
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
