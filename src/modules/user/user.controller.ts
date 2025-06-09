import { Body, Controller, Post } from '@nestjs/common';
import { USER_TYPE } from 'src/utils/constants';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly doctorService: DoctorService,
  ) {}

  @Post('/create')
  async create(@Body() createUserDto: CreateDoctorDto) {
    if (createUserDto.type === USER_TYPE.DOCTOR) {
      const response = await this.doctorService.createDoctor(createUserDto);
      return response;
    }
    const response = await this.userService.createUser(createUserDto);
    return response;
  }
}
