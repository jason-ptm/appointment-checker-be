import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Communication } from 'src/database/model/communication.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommunicationService } from './communication.service';
import { CreateCommunicationDto } from './dto/create-communication.dto';

@ApiTags('communications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('communication')
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new communication for an appointment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The communication has been successfully created.',
    type: () => Communication,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or appointment not found.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Appointment not found.',
  })
  async create(
    @Body() createCommunicationDto: CreateCommunicationDto,
  ): Promise<Communication> {
    return this.communicationService.create(createCommunicationDto);
  }

  @Get('/appointment/:appointmentId')
  @ApiOperation({
    summary: 'Get all communications for a specific appointment',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all communications for the appointment.',
    type: () => [Communication],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Appointment not found.',
  })
  async findByAppointmentId(
    @Param('appointmentId') appointmentId: string,
  ): Promise<Communication[]> {
    return this.communicationService.findByAppointmentId(appointmentId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all communications' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all communications.',
    type: () => [Communication],
  })
  async findAll(): Promise<Communication[]> {
    return this.communicationService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a specific communication by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the communication.',
    type: () => Communication,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Communication not found.',
  })
  async findOne(@Param('id') id: string): Promise<Communication> {
    return this.communicationService.findOne(id);
  }

  @Patch('/:id/status')
  @ApiOperation({ summary: 'Update communication status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The communication status has been successfully updated.',
    type: () => Communication,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Communication not found.',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<Communication> {
    return this.communicationService.updateStatus(id, body.status);
  }
}
