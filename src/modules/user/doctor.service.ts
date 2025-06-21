import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from 'src/database/model/doctor.entity';
import { DoctorCalendar } from 'src/database/model/doctorCalendar.entity';
import { SpecialityDoctor } from 'src/database/model/specialityDoctor.entity';
import { SHIFTS, USER_TYPE } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { CalendarService } from '../calendar/calendar.service';
import { SpecialityService } from '../speciality/speciality.service';
import { CreateDoctorDto } from './dto/create.dto';
import { UserService } from './user.service';
import { Appointment } from 'src/database/model/appointment.entity';
import { User } from 'src/database/model/user.entity';

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

      const specialityDoctor = this.specialityDoctorRepository.create({
        idDoctor: existingUser.doctorId,
        idSpeciality: speciality,
      });

      await this.specialityDoctorRepository.save(specialityDoctor);

      return await this.doctorRepository.save({
        ...existingUser,
        doctorCalendar: doctorCalendars,
        specialityDoctor: [specialityDoctor],
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
}
