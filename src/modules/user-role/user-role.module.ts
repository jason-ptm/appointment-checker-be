import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from 'src/database/model/userRole.entity';
import { User } from 'src/database/model/user.entity';
import { RoleModule } from '../role/role.module';
import { UserRoleService } from './user-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, User]), RoleModule],
  providers: [UserRoleService],
  exports: [UserRoleService, TypeOrmModule],
})
export class UserRoleModule {}
