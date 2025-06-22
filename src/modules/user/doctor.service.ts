import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from 'src/database/model/doctor.entity';
import { DoctorCalendar } from 'src/database/model/doctorCalendar.entity';
import { SpecialityDoctor } from 'src/database/model/specialityDoctor.entity';
import { SHIFTS, USER_TYPE, APPOINTMENT_STATUS } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { CalendarService } from '../calendar/calendar.service';
import { SpecialityService } from '../speciality/speciality.service';
import { CreateDoctorDto } from './dto/create.dto';
import { UserService } from './user.service';
import { Appointment } from 'src/database/model/appointment.entity';
import { User } from 'src/database/model/user.entity';
import { Speciality } from 'src/database/model/speciality.entity';
import { Communication } from 'src/database/model/communication.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(DoctorCalendar)
    private readonly doctorCalendarRepository: Repository<DoctorCalendar>,
    @InjectRepository(SpecialityDoctor)
    private readonly specialityDoctorRepository: Repository<SpecialityDoctor>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Speciality)
    private readonly specialityRepository: Repository<Speciality>,
    @InjectRepository(Communication)
    private readonly communicationRepository: Repository<Communication>,
    private readonly calendarService: CalendarService,
    private readonly specialityService: SpecialityService,
    private readonly userService: UserService,
  ) {}

  async createDoctor({
    id,
    name,
    phoneNumber,
    region,
    speciality,
  }: CreateDoctorDto) {
    try {
      await this.userService.createUser({
        id,
        name,
        phoneNumber,
        region,
        type: USER_TYPE.DOCTOR,
      });
      const existingUser = await this.doctorRepository.save(
        this.doctorRepository.create({
          doctorId: id,
          userId: id,
        }),
      );
      const existingUser = await this.doctorRepository.save(
        this.doctorRepository.create({
          doctorId: id,
          userId: id,
        }),
      );

      const defaultCalendars = await this.calendarService.findByKey(
        SHIFTS.REGULAR,
      );
      const defaultCalendars = await this.calendarService.findByKey(
        SHIFTS.REGULAR,
      );
      const doctorCalendars: DoctorCalendar[] = [];


      await Promise.all(
        defaultCalendars.map(async (calendar) => {
        defaultCalendars.map(async (calendar) => {
          const doctorCalendar = this.doctorCalendarRepository.create({
            idDoctor: existingUser.doctorId,
            idDoctor: existingUser.doctorId,
            idCalendar: calendar.id,
          });
          await this.doctorCalendarRepository.save(doctorCalendar);
          doctorCalendars.push(doctorCalendar);
        }),
      );

      const specialityDoctor = this.specialityDoctorRepository.create({
        idDoctor: existingUser.doctorId,
        idSpeciality: speciality,
        idDoctor: existingUser.doctorId,
        idSpeciality: speciality,
      });

      await this.specialityDoctorRepository.save(specialityDoctor);

      return await this.doctorRepository.save({
      return await this.doctorRepository.save({
        ...existingUser,
        doctorCalendar: doctorCalendars,
        specialityDoctor: [specialityDoctor],
      });
      });
    } catch (error) {
      console.log(`Error creating user ${id}:`, error);
      return {
        message: `Error creating user ${id}`,
      };
    }
  }

  async findBySpeciality(specialityId: string) {
    try {
      const doctors = await this.doctorRepository
        .createQueryBuilder('doctor')
        .leftJoinAndSelect('doctor.userId', 'user')
        .innerJoin('Speciality_Doctor', 'sd', 'sd.idDoctor = doctor.doctorId')
        .where('sd.idSpeciality = :specialityId', {
          specialityId,
        })
        .getMany();

      const results = await Promise.all(
        doctors.map(async (doctor) => {
          if (!doctor.userId) {
            return null;
          }

          const user = doctor.userId as unknown as User;
          if (!user) {
            return null;
          }

          // Get appointments for this doctor
          const appointments = await this.appointmentRepository
            .createQueryBuilder('appointment')
            .where('appointment.idDoctor = :doctorId', {
              doctorId: doctor.doctorId,
            })
            .andWhere('appointment.status IN (:...statuses)', {
              statuses: ['CONFIRMED', 'PENDING'],
            })
            .orderBy('appointment.appointmentDate', 'ASC')
            .getMany();

          // Transform appointments into calendar format
          const calendars = appointments.map((appointment) => {
            const startDate = new Date(appointment.appointmentDate);
            const endDate = new Date(startDate.getTime() + 45 * 60000); // Add 45 minutes

            return {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            };
          });

          return {
            doctor: {
              id: doctor.doctorId,
              name: user.name,
            },
            calendars,
          };
        }),
      );

      return results.filter((result) => result !== null);
    } catch (error) {
      console.log(`Error finding doctors by specialty ${specialityId}:`, error);
      return {
        message: `Error finding doctors by specialty ${specialityId}`,
      };
    }
  }

  async getAppointmentsByDoctorId(doctorId: string) {
    try {
      const totalAppointments = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .where('appointment.idDoctor = :doctorId', { doctorId })
        .getCount();

      const pendingAppointments = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .where('appointment.idDoctor = :doctorId', { doctorId })
        .andWhere('appointment.status = :status', {
          status: APPOINTMENT_STATUS.PENDING,
        })
        .getCount();

      const completedAppointments = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .where('appointment.idDoctor = :doctorId', { doctorId })
        .andWhere('appointment.status = :status', {
          status: APPOINTMENT_STATUS.COMPLETED,
        })
        .getCount();

      const confirmedAppointmentsData = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .select([
          'appointment.id',
          'appointment.appointmentDate',
          'appointment.idSpeciality',
          'appointment.idPatient',
        ])
        .where('appointment.idDoctor = :doctorId', { doctorId })
        .andWhere('appointment.status = :status', {
          status: APPOINTMENT_STATUS.CONFIRMED,
        })
        .orderBy('appointment.appointmentDate', 'ASC')
        .getMany();

      // Get speciality and patient details for confirmed appointments
      const confirmedAppointments = await Promise.all(
        confirmedAppointmentsData.map(async (appointment) => {
          const speciality = await this.specialityRepository.findOne({
            where: { id: appointment.idSpeciality },
          });
          const patient = await this.userRepository.findOne({
            where: { id: appointment.idPatient },
          });

          return {
            id: appointment.id,
            appointmentDate: appointment.appointmentDate,
            speciality: {
              id: appointment.idSpeciality,
              name: speciality?.name || '',
            },
            patient: {
              id: appointment.idPatient,
              name: patient?.name || '',
            },
          };
        }),
      );

      return {
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        confirmedAppointments,
      };
    } catch (error) {
      console.log(`Error getting appointments for doctor ${doctorId}:`, error);
      return {
        message: `Error getting appointments for doctor ${doctorId}`,
      };
    }
  }

  async getAllAppointmentsByDoctorId(doctorId: string) {
    try {
      // Verificar que el doctor existe
      const doctor = await this.doctorRepository.findOne({
        where: { doctorId },
      });

      if (!doctor) {
        return {
          success: false,
          message: `Doctor with ID ${doctorId} not found`,
        };
      }

      // Obtener información del usuario (doctor)
      const user = await this.userRepository.findOne({
        where: { id: doctor.userId },
      });

      // Obtener todas las citas del doctor
      const appointments = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .where('appointment.idDoctor = :doctorId', { doctorId })
        .orderBy('appointment.appointmentDate', 'ASC')
        .getMany();

      // Obtener información detallada de pacientes y especialidades
      const formattedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          const speciality = await this.specialityRepository.findOne({
            where: { id: appointment.idSpeciality },
          });
          const patient = await this.userRepository.findOne({
            where: { id: appointment.idPatient },
          });

          // Contar las comunicaciones asociadas a esta cita
          const communicationCount = await this.communicationRepository
            .createQueryBuilder('communication')
            .where('communication.idAppointment = :appointmentId', {
              appointmentId: appointment.id,
            })
            .getCount();

          return {
            id: appointment.id,
            appointmentDate: appointment.appointmentDate,
            status: appointment.status,
            communicationCount,
            patient: {
              id: appointment.idPatient,
              name: patient?.name || 'N/A',
              phoneNumber: patient?.phoneNumber || 'N/A',
              region: patient?.region || 'N/A',
            },
            speciality: {
              id: appointment.idSpeciality,
              name: speciality?.name || 'N/A',
            },
          };
        }),
      );

      // Ordenar las citas por estado y luego por fecha
      const sortedAppointments = formattedAppointments.sort((a, b) => {
        // Definir el orden de prioridad de los estados
        const statusOrder: Record<string, number> = {
          CONFIRMED: 1,
          PENDING: 2,
          COMPLETED: 3,
          CANCELLED: 4,
        };

        const statusA = statusOrder[a.status] || 999;
        const statusB = statusOrder[b.status] || 999;

        // Si los estados son diferentes, ordenar por estado
        if (statusA !== statusB) {
          return statusA - statusB;
        }

        // Si los estados son iguales, ordenar por fecha de cita
        const dateA = new Date(a.appointmentDate);
        const dateB = new Date(b.appointmentDate);
        return dateA.getTime() - dateB.getTime();
      });

      return {
        success: true,
        doctor: {
          id: doctor.doctorId,
          name: user?.name || 'N/A',
        },
        totalAppointments: appointments.length,
        appointments: sortedAppointments,
      };
    } catch (error) {
      console.log(
        `Error getting all appointments for doctor ${doctorId}:`,
        error,
      );
      return {
        success: false,
        message: `Error getting appointments for doctor ${doctorId}`,
      };
    }
  }
}
