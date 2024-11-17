// src/tokens/token.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { TokenService } from './token.service';
import { UserService } from 'src/modules/users/users.service';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/users/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token, User, Role])], // Register ActiveToken entity with TypeORM
  providers: [TokenService, UserService], // Register TokenService as a provider
  exports: [TokenService], // Export TokenService to make it available to other modules
})
export class TokenModule {}
