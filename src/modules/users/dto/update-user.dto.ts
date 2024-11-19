import { PartialType } from '@nestjs/mapped-types'; // Import PartialType for partial updates
import { CreateUserDto } from './create-user.dto'; // Import CreateUserDto for base validation

// UpdateUserDto allows partial updates to a user
export class UpdateUserDto extends PartialType(CreateUserDto) {}
