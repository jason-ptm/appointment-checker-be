import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { USER_TYPE } from 'src/utils/constants';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
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

  @Get('/doctor/speciality')
  @UseGuards(JwtAuthGuard)
  findByDoctor(@Query('speciality') speciality: string) {
    return this.doctorService.findBySpeciality(speciality);
  }
}
