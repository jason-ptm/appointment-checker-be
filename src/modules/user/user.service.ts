import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/model/user.entity';
import { ErrorResponse } from 'src/utils/model/error';
import { Repository } from 'typeorm';
import { UserRoleService } from '../user-role/user-role.service';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: UserRoleService,
  ) {}

  async createUser({
    id,
    name,
    phoneNumber,
    region,
    type,
  }: CreateUserDto): Promise<User | ErrorResponse> {
    try {
      let existingUser = this.userRepository.create({
        id,
        name,
        phoneNumber,
        region,
        type,
      });
      existingUser = await this.userRepository.save(existingUser);
      await this.roleService.createRolesByUserType(type, id);
      return this.userRepository.save(existingUser);
    } catch (error) {
      console.log(`Error creating user ${id}:`, error);
      return {
        message: `Error creating user ${id}`,
      };
    }
  }
}
