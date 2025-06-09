import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from 'src/database/model/doctor.entity';
import { DoctorCalendar } from 'src/database/model/doctorCalendar.entity';
import { SpecialityDoctor } from 'src/database/model/specialityDoctor.entity';
import { User } from 'src/database/model/user.entity';
import { CalendarModule } from '../calendar/calendar.module';
import { CalendarService } from '../calendar/calendar.service';
import { SpecialityModule } from '../speciality/speciality.module';
import { SpecialityService } from '../speciality/speciality.service';
import { UserRoleModule } from '../user-role/user-role.module';
import { DoctorService } from './doctor.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Doctor, DoctorCalendar, SpecialityDoctor]),
    UserRoleModule,
    CalendarModule,
    SpecialityModule,
  ],
  providers: [UserService, DoctorService, CalendarService, SpecialityService],
  controllers: [UserController],
})
export class UserModule {}
