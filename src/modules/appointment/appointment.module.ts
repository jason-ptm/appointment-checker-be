import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment } from 'src/database/model/appointment.entity';
import { Doctor } from 'src/database/model/doctor.entity';
import { Speciality } from 'src/database/model/speciality.entity';
import { User } from 'src/database/model/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Doctor, Speciality, User])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
