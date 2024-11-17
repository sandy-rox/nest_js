import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from 'src/modules/token/token.module';
import { UserModule } from 'src/modules/users/users.module';
import { TokenService } from 'src/modules/token/token.service';
import { UserService } from 'src/modules/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/modules/token/entities/token.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/users/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token, User, Role]), UserModule, TokenModule],
  providers: [AuthService, TokenService, UserService],
  controllers: [AuthController],
  exports: [AuthService, TokenService, UserService],
})
export class AuthModule {}
