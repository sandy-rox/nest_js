import { Body, Controller, Get, NotFoundException, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { UserResponse } from './type/userResponse';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/role.guard';

@Controller({ path: 'users', version: '1' })
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('admin')
  async findAll(): Promise<Partial<User>[]> {
    try {
      const users = await this.userService.findAll();
      return users.map((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userData } = user;
        return userData;
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Cannot find products`);
    }
  }

  @Get(':id')
  @Roles('admin')
  async findUserById(@Param('id') userId: string): Promise<UserResponse> {
    const id = parseInt(userId, 10);
    try {
      return await this.userService.findOneById(id);
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Cannot find user #${id}`);
    }
  }

  @Patch(':id/role')
  @Roles('admin')
  async updateUserRole(@Param('id') userId: number, @Body('role') roleName: string) {
    return this.userService.updateUserRole(userId, roleName);
  }
}
