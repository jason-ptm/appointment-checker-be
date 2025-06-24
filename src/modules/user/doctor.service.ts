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
    specialities,
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

      const defaultCalendars = await this.calendarService.findByKey(
        SHIFTS.REGULAR,
      );
      const doctorCalendars: DoctorCalendar[] = [];

      await Promise.all(
        defaultCalendars.map(async (calendar) => {
          const doctorCalendar = this.doctorCalendarRepository.create({
            idDoctor: existingUser.doctorId,
            idCalendar: calendar.id,
          });
          await this.doctorCalendarRepository.save(doctorCalendar);
          doctorCalendars.push(doctorCalendar);
        }),
      );

      // Crear múltiples especialidades para el doctor
      const specialityDoctors = await Promise.all(
        specialities.map(async (specialityId) => {
          const specialityDoctor = this.specialityDoctorRepository.create({
            idDoctor: existingUser.doctorId,
            idSpeciality: specialityId,
          });
          return await this.specialityDoctorRepository.save(specialityDoctor);
        }),
      );

      return await this.doctorRepository.save({
        ...existingUser,
        doctorCalendar: doctorCalendars,
        specialityDoctor: specialityDoctors,
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

      // Obtener todos los IDs únicos de especialidades y pacientes
      const specialityIds = [
        ...new Set(appointments.map((a) => a.idSpeciality)),
      ];
      const patientIds = [...new Set(appointments.map((a) => a.idPatient))];

      // Obtener todas las especialidades y pacientes en una sola consulta
      const specialities = await this.specialityRepository
        .createQueryBuilder('speciality')
        .where('speciality.id IN (:...ids)', { ids: specialityIds })
        .getMany();

      const patients = await this.userRepository
        .createQueryBuilder('patient')
        .where('patient.id IN (:...ids)', { ids: patientIds })
        .getMany();

      // Crear mapas para acceso rápido
      const specialityMap = new Map(specialities.map((s) => [s.id, s]));
      const patientMap = new Map(patients.map((p) => [p.id, p]));

      // Obtener información detallada de pacientes y especialidades
      const formattedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          // Contar las comunicaciones asociadas a esta cita
          const communicationCount = await this.communicationRepository
            .createQueryBuilder('communication')
            .where('communication.idAppointment = :appointmentId', {
              appointmentId: appointment.id,
            })
            .getCount();

          const speciality = specialityMap.get(appointment.idSpeciality);
          const patient = patientMap.get(appointment.idPatient);

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

      // Ordenar las citas por fecha, con las canceladas al final
      const sortedAppointments = formattedAppointments.sort((a, b) => {
        // Si una está cancelada y la otra no, la cancelada va al final
        if (a.status === 'CANCELLED' && b.status !== 'CANCELLED') {
          return 1;
        }
        if (a.status !== 'CANCELLED' && b.status === 'CANCELLED') {
          return -1;
        }

        // Si ambas tienen el mismo estado (canceladas o no canceladas), ordenar por fecha
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
