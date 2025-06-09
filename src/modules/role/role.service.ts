import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/database/model/role.entity';
import { Like, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const role = this.roleRepository.create(createRoleDto);
      return this.roleRepository.save(role);
    } catch (error) {
      console.log(`Error creating role: ${createRoleDto.key}`, error);
      throw new Error(`Error creating role: ${createRoleDto.key}`);
    }
  }

  findByUserType(userType: string): Promise<Role[]> {
    return this.roleRepository.find({
      where: {
        key: Like(`%${userType}%`),
      },
    });
  }

  findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
