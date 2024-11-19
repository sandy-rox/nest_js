import { Body, Controller, Get, NotFoundException, Param, Patch, UseGuards } from '@nestjs/common'; // Import necessary decorators and classes
import { UserService } from './users.service'; // Import the UserService to interact with the database
import { User } from './entities/user.entity'; // Import the User entity
import { UserResponse } from './type/userResponse'; // Import the UserResponse type to format the output
import { Roles } from '../auth/decorator/roles.decorator'; // Import the custom Roles decorator for role-based access
import { RolesGuard } from '../auth/guard/role.guard'; // Import the RolesGuard to guard routes based on roles

@Controller({ path: 'users', version: '1' }) // Define the path and API version
@UseGuards(RolesGuard) // Apply RolesGuard to the controller, ensuring role-based access control
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Route to get all users (Only accessible by admin role)
  @Get()
  @Roles('admin')
  async findAll(): Promise<Partial<User>[]> {
    try {
      const users = await this.userService.findAll(); // Fetch all users
      return users.map((user) => {
        // Exclude the password field before returning the user data
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userData } = user;
        return userData; // Return the user data without the password
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Cannot find users`); // Handle errors and return appropriate error messages
    }
  }

  // Route to get a user by their ID (Only accessible by admin role)
  @Get(':id')
  @Roles('admin')
  async findUserById(@Param('id') userId: string): Promise<UserResponse> {
    const id = parseInt(userId, 10); // Convert userId string to integer
    try {
      return await this.userService.findOneById(id); // Fetch a user by ID
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Cannot find user #${id}`); // Handle errors and return appropriate error messages
    }
  }

  // Route to update the role of a user (Only accessible by admin role)
  @Patch(':id/role')
  @Roles('admin')
  async updateUserRole(@Param('id') userId: number, @Body('role') roleName: string) {
    return this.userService.updateUserRole(userId, roleName); // Update user role
  }
}
