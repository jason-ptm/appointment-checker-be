import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { USER_TYPE } from 'src/utils/constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create.dto';
import { UserService } from './user.service';

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

  @Get('/doctor/:doctorId/appointments')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get appointments statistics and details by doctor ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns appointment statistics and confirmed appointments with details',
  })
  getAppointmentsByDoctorId(@Param('doctorId') doctorId: string) {
    return this.doctorService.getAppointmentsByDoctorId(doctorId);
  }

  @Get('/doctor/:doctorId/all-appointments')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all appointments with detailed information by doctor ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all appointments with patient and speciality details',
  })
  getAllAppointmentsByDoctorId(@Param('doctorId') doctorId: string) {
    return this.doctorService.getAllAppointmentsByDoctorId(doctorId);
  }
}
