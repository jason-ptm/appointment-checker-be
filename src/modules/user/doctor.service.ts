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

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(DoctorCalendar)
    private readonly doctorCalendarRepository: Repository<DoctorCalendar>,
    @InjectRepository(SpecialityDoctor)
    private readonly specialityDoctorRepository: Repository<SpecialityDoctor>,
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
      let existingUser = this.doctorRepository.create({
        doctorId: id,
        userId: id,
      });
      existingUser = await this.doctorRepository.save(existingUser);

      const calendars = await this.calendarService.findByKey(SHIFTS.REGULAR);
      const doctorCalendars: DoctorCalendar[] = [];
      await Promise.all(
        calendars.map(async (calendar) => {
          const doctorCalendar = this.doctorCalendarRepository.create({
            idDoctor: id,
            idCalendar: calendar.id,
          });

          await this.doctorCalendarRepository.save(doctorCalendar);
          doctorCalendars.push(doctorCalendar);
        }),
      );

      const specialityDoc = await this.specialityService.findByKey(speciality);

      if (!specialityDoc) {
        return {
          message: 'No speciality found!',
        };
      }

      const specialityDoctor = this.specialityDoctorRepository.create({
        idDoctor: id,
        idSpeciality: specialityDoc.id,
      });

      await this.specialityDoctorRepository.save(specialityDoctor);

      existingUser = {
        ...existingUser,
        doctorCalendar: doctorCalendars,
        specialityDoctor: [specialityDoctor],
      };

      return await this.doctorRepository.save(existingUser);
    } catch (error) {
      console.log(`Error creating user ${id}:`, error);
      return {
        message: `Error creating user ${id}`,
      };
    }
  }
}
