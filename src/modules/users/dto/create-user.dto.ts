import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator'; // Import validation decorators

export class CreateUserDto {
  // Validate that first name is a non-empty string
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  // Validate that last name is a non-empty string
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  // Validate that the email is a valid email format
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  // Validate that password is a string with a minimum length of 6 characters
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
