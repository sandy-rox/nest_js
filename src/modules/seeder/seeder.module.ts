import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederCommand } from './seeder.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/modules/users/entities/role.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User]), // Add User repository here
  ],
  providers: [SeederService, SeederCommand],
})
export class SeederModule {}
