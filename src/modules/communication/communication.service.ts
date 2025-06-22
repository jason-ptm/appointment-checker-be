import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/database/model/appointment.entity';
import { Communication } from 'src/database/model/communication.entity';
import { COMMUNICATION_STATUS_TYPE } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { CreateCommunicationDto } from './dto/create-communication.dto';

@Injectable()
export class CommunicationService {
  constructor(
    @InjectRepository(Communication)
    private readonly communicationRepository: Repository<Communication>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(
    createCommunicationDto: CreateCommunicationDto,
  ): Promise<Communication> {
    const { appointmentId, type, startDate, status } = createCommunicationDto;

    // Verify that the appointment exists
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointmentId} not found`,
      );
    }

    const communication = this.communicationRepository.create({
      type,
      startDate: new Date(startDate),
      status: status || COMMUNICATION_STATUS_TYPE.PENDING,
      idAppointment: appointmentId,
    });

    return this.communicationRepository.save(communication);
  }

  async findByAppointmentId(appointmentId: string): Promise<Communication[]> {
    // Verify that the appointment exists
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointmentId} not found`,
      );
    }

    return this.communicationRepository.find({
      where: { idAppointment: appointmentId },
      order: { startDate: 'DESC' },
    });
  }

  async findAll(): Promise<Communication[]> {
    return this.communicationRepository.find({
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Communication> {
    const communication = await this.communicationRepository.findOne({
      where: { id },
    });

    if (!communication) {
      throw new NotFoundException(`Communication with ID ${id} not found`);
    }

    return communication;
  }

  async updateStatus(id: string, status: string): Promise<Communication> {
    const communication = await this.findOne(id);

    communication.status = status;
    return this.communicationRepository.save(communication);
  }
}
