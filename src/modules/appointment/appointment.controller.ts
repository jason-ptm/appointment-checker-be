import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Patch,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Appointment } from 'src/database/model/appointment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  AppointmentService,
  AppointmentWithDetails,
} from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The appointment has been successfully created.',
    type: () => Appointment,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or appointment conflict.',
  })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get('/user/:userId')
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<AppointmentWithDetails[]> {
    return this.appointmentService.findByUser(userId);
  }

  @Patch('/:appointmentId/status')
  @ApiOperation({ summary: 'Update appointment status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The appointment status has been successfully updated.',
    type: () => Appointment,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or appointment not found.',
  })
  async updateStatus(
    @Param('appointmentId') appointmentId: string,
    @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ): Promise<Appointment> {
    const result = await this.appointmentService.updateAppointmentStatus(
      appointmentId,
      updateAppointmentStatusDto.status,
    );
    return result;
  }

  @Get('/debug/health')
  @ApiOperation({ summary: 'Check database health for debugging' })
  async checkDatabaseHealth() {
    return this.appointmentService.checkDatabaseHealth();
  }

  @Delete('/debug/:appointmentId')
  @ApiOperation({ summary: 'Delete appointment by ID for debugging' })
  async deleteAppointment(@Param('appointmentId') appointmentId: string) {
    await this.appointmentService.deleteById(appointmentId);
    return { message: 'Appointment deleted successfully' };
  }

  @Delete('/debug/clean')
  @ApiOperation({ summary: 'Clean all appointments from database' })
  async cleanDatabase() {
    return this.appointmentService.cleanDatabase();
  }

  @Post('/debug/reset')
  @ApiOperation({
    summary: 'Reset appointment table (DANGEROUS - drops table)',
  })
  async resetDatabase() {
    return this.appointmentService.resetDatabase();
  }

  @Get('/debug/test-uuid')
  @ApiOperation({ summary: 'Test UUID generation' })
  async testUuidGeneration() {
    return this.appointmentService.testUuidGeneration();
  }
}
