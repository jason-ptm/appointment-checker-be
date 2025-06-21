import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/model/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';

export interface UserRole {
  id: string;
  description: string;
  key: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { id: loginDto.id },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      return {
        user: {
          type: 'NEW-USER',
        },
      };
    }

    const roles = user.userRoles.map((role) => role.role.key);

    const payload = {
      sub: user.id,
      name: user.name,
      type: user.type,
      roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        type: user.type,
        roles,
      },
    };
  }
}
