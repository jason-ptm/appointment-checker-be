import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { console } from 'inspector';
import { Role } from 'src/database/model/role.entity';
import { UserRole } from 'src/database/model/userRole.entity';
import { USER_TYPE } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly roleService: RoleService,
  ) {}

  async createUserRole(roles: Role[], idUser: string): Promise<UserRole[]> {
    try {
      const finallRoles: UserRole[] = [];

      const userRoles = roles.map(async (role) => {
        const roleRep = this.userRoleRepository.create({
          idUser,
          idRole: role.id,
        });
        const finallRole = await this.userRoleRepository.save(roleRep);
        console.log(finallRole);
        finallRoles.push(finallRole);

        return roleRep;
      });
      return Promise.all(userRoles).then(() => finallRoles);
    } catch (error) {
      console.log(`Error creating user roles for user ${idUser}:`, error);
      return [];
    }
  }

  async createRolesByUserType(
    userType: string,
    idUser: string,
  ): Promise<UserRole[]> {
    try {
      if (userType === USER_TYPE.ADMIN) {
        const roles = await this.roleService.findAll();
        return this.createUserRole(roles, idUser);
      } else if (userType === USER_TYPE.DOCTOR) {
        const doctorRoles = await this.roleService.findByUserType(userType);
        const userRoles = await this.roleService.findByUserType(
          USER_TYPE.PATIENT,
        );
        return this.createUserRole([...doctorRoles, ...userRoles], idUser);
      }
      const roles = await this.roleService.findByUserType(userType);
      return this.createUserRole(roles, idUser);
    } catch (error) {
      console.log(`Error fetching roles for user type ${userType}:`, error);
      return [];
    }
  }
}
