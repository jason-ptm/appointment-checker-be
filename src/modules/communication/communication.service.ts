import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Appointment } from 'src/database/model/appointment.entity';
import { Communication } from 'src/database/model/communication.entity';
import { User } from 'src/database/model/user.entity';
import { Doctor } from 'src/database/model/doctor.entity';
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private readonly httpService: HttpService,
  ) {}

  private async sendMessageToExternalService(
    appointmentId: string,
  ): Promise<void> {
    try {
      // Get appointment with related data
      const appointment = await this.appointmentRepository.findOne({
        where: { id: appointmentId },
        relations: ['patient', 'doctor'],
      });

      if (!appointment) {
        throw new NotFoundException(
          `Appointment with ID ${appointmentId} not found`,
        );
      }

      // Get doctor's user information
      const doctorUser = await this.userRepository.findOne({
        where: { id: appointment.doctor.userId },
      });

      if (!doctorUser) {
        throw new NotFoundException(
          `Doctor user not found for appointment ${appointmentId}`,
        );
      }

      // Format appointment date and time
      const appointmentDate = new Date(appointment.appointmentDate);
      const formattedDate = this.formatDateToSpanish(appointmentDate);
      const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const messageData = {
        phone_number: appointment.patient?.phoneNumber || '',
        appointment_data: {
          appointment_id: appointment.id,
          patient_name: appointment.patient?.name || '',
          appointment_date: formattedDate,
          appointment_time: formattedTime,
          doctor_name: `Dr. ${doctorUser.name}`,
        },
      };

      // Make HTTP request to external service
      const response = await firstValueFrom(
        this.httpService.post(
          'http://localhost:8000/send-message',
          messageData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      console.log('Message sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to send message: ${errorMessage}`);
    }
  }

  private formatDateToSpanish(date: Date): string {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} de ${month}, ${year}`;
  }

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

    const savedCommunication =
      await this.communicationRepository.save(communication);

    // Send message to external service
    try {
      await this.sendMessageToExternalService(appointmentId);
    } catch (error) {
      console.error(
        'Failed to send message, but communication was saved:',
        error,
      );
      // You might want to update the communication status to indicate the message failed
    }

    return savedCommunication;
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
