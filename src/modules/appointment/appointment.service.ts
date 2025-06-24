import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addMinutes } from 'date-fns';
import { Appointment } from 'src/database/model/appointment.entity';
import { Doctor } from 'src/database/model/doctor.entity';
import { Speciality } from 'src/database/model/speciality.entity';
import { User } from 'src/database/model/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

export interface AppointmentWithDetails {
  id: string;
  appointmentDate: string;
  status: string;
  speciality: {
    id: string;
    name: string;
  };
  doctor: {
    doctorId: string;
    userId: string;
    name: string;
    phoneNumber: string;
    region: string;
  };
}

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Speciality)
    private specialityRepository: Repository<Speciality>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const { patientId, doctorId, appointmentDate, specialityId } =
      createAppointmentDto;

    const patient = await this.userRepository.findOne({
      where: { id: patientId },
    });
    if (!patient) {
      throw new BadRequestException('Patient not found');
    }

    const doctor = await this.doctorRepository.findOne({ where: { doctorId } });
    if (!doctor) {
      throw new BadRequestException('Doctor not found');
    }

    const speciality = await this.specialityRepository.findOne({
      where: { id: specialityId },
    });
    if (!speciality) {
      throw new BadRequestException('Speciality not found');
    }

    const appointmentStart = new Date(appointmentDate);
    const appointmentEnd = addMinutes(appointmentStart, 45);

    const startDateISO = appointmentStart.toISOString();
    const endDateISO = appointmentEnd.toISOString();

    const overlappingAppointment = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.id_doctor = :doctorId', { doctorId })
      .andWhere(`appointment.appointment_date BETWEEN :start AND :end`, {
        start: startDateISO,
        end: endDateISO,
      })
      .getOne();

    if (overlappingAppointment) {
      throw new BadRequestException(
        'There is already an appointment scheduled for this time slot',
      );
    }

    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        let newId: string;
        let existingAppointment: Appointment | null;

        do {
          newId = uuidv4();
          existingAppointment = await this.appointmentRepository.findOne({
            where: { id: newId },
          });
        } while (existingAppointment && attempts < maxAttempts);

        if (existingAppointment) {
          attempts++;
          continue;
        }

        const appointment = this.appointmentRepository.create({
          id: newId,
          appointmentDate: appointmentStart.toISOString(),
          idPatient: patientId,
          idDoctor: doctorId,
          idSpeciality: specialityId,
        });

        return await this.appointmentRepository.save(appointment);
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error);

        if (
          error instanceof QueryFailedError &&
          error.message.includes('ORA-00001')
        ) {
          attempts++;
          if (attempts >= maxAttempts) {
            throw new ConflictException(
              'Unable to create appointment after multiple attempts due to ID conflicts',
            );
          }
          continue;
        }

        throw error;
      }
    }

    // This should never be reached, but TypeScript needs it
    throw new Error('Failed to create appointment after all attempts');
  }

  async findByUser(userId: string): Promise<AppointmentWithDetails[]> {
    const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.id_patient = :userId', { userId })
      .orderBy('appointment.appointmentDate', 'ASC')
      .getMany();

    const appointmentsWithDetails = await Promise.all(
      appointments.map(async (appointment) => {
        const speciality = await this.specialityRepository.findOne({
          where: { id: appointment.idSpeciality },
        });

        const doctor = await this.doctorRepository.findOne({
          where: { doctorId: appointment.idDoctor },
        });

        const doctorUser = await this.userRepository.findOne({
          where: { id: doctor?.userId },
        });

        return {
          id: appointment.id,
          appointmentDate: appointment.appointmentDate,
          status: appointment.status,
          speciality: {
            id: speciality?.id || '',
            name: speciality?.name || '',
          },
          doctor: {
            doctorId: doctor?.doctorId || '',
            userId: doctorUser?.id || '',
            name: doctorUser?.name || '',
            phoneNumber: doctorUser?.phoneNumber || '',
            region: doctorUser?.region || '',
          },
        };
      }),
    );

    return appointmentsWithDetails;
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: string,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    appointment.status = status;
    const savedAppointment = await this.appointmentRepository.save(appointment);

    if (!savedAppointment) {
      throw new BadRequestException('Failed to update appointment');
    }

    return savedAppointment;
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }

  async findById(appointmentId: string): Promise<Appointment | null> {
    return this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });
  }

  async checkDatabaseHealth(): Promise<{ total: number; duplicates: any[] }> {
    const allAppointments = await this.appointmentRepository.find();
    const ids = allAppointments.map((a) => a.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

    return {
      total: allAppointments.length,
      duplicates: duplicates.length > 0 ? duplicates : [],
    };
  }

  async deleteById(appointmentId: string): Promise<void> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });

    if (appointment) {
      await this.appointmentRepository.remove(appointment);
    }
  }

  async cleanDatabase(): Promise<{ deleted: number; message: string }> {
    try {
      // Get all appointments
      const allAppointments = await this.appointmentRepository.find();

      if (allAppointments.length === 0) {
        return { deleted: 0, message: 'No appointments found to clean' };
      }

      // Delete all appointments
      await this.appointmentRepository.remove(allAppointments);

      return {
        deleted: allAppointments.length,
        message: `Successfully deleted ${allAppointments.length} appointments`,
      };
    } catch (error) {
      console.error('Error cleaning database:', error);
      throw new Error('Failed to clean database');
    }
  }

  async resetDatabase(): Promise<{ message: string }> {
    try {
      // Drop and recreate the appointment table
      await this.appointmentRepository.query(
        'DROP TABLE "Appointment" CASCADE',
      );
      await this.appointmentRepository.query(`
        CREATE TABLE "Appointment" (
          "id" VARCHAR2(36) PRIMARY KEY,
          "appointment_date" VARCHAR2(255) NOT NULL,
          "status" VARCHAR2(255) DEFAULT 'PENDING',
          "id_speciality" VARCHAR2(36),
          "id_doctor" VARCHAR2(36),
          "id_patient" VARCHAR2(36)
        )
      `);

      return { message: 'Database reset successfully' };
    } catch (error) {
      console.error('Error resetting database:', error);
      throw new Error('Failed to reset database');
    }
  }

  testUuidGeneration(): Promise<{ success: boolean; uuids: string[] }> {
    const uuids: string[] = [];
    const testCount = 10;

    for (let i = 0; i < testCount; i++) {
      const uuid = uuidv4();
      uuids.push(uuid);

      // Check if this UUID already exists in our test array
      if (uuids.indexOf(uuid) !== uuids.lastIndexOf(uuid)) {
        return Promise.resolve({ success: false, uuids });
      }
    }

    return Promise.resolve({ success: true, uuids });
  }
}
