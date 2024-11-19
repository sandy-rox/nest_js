import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object (DTO) for user registration.
 * This class validates input data for user registration requests, ensuring the fields meet specified constraints.
 */
export class RegisterUserDto {
  /**
   * The first name of the user.
   * @example 'John'
   * @decorator `@IsString()` ensures the value is a string.
   * @decorator `@IsNotEmpty()` ensures the field is not empty.
   */
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  /**
   * The last name of the user.
   * @example 'Doe'
   * @decorator `@IsString()` ensures the value is a string.
   * @decorator `@IsNotEmpty()` ensures the field is not empty.
   */
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  /**
   * The email address of the user.
   * @example 'john.doe@example.com'
   * @decorator `@IsEmail()` ensures the value is a valid email address.
   */
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  /**
   * The password of the user.
   * @example 'securepassword'
   * @decorator `@IsString()` ensures the value is a string.
   * @decorator `@MinLength(6)` enforces a minimum length of 6 characters.
   */
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
