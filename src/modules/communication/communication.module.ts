import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CommunicationService } from './communication.service';
import { CommunicationController } from './communication.controller';
import { Communication } from 'src/database/model/communication.entity';
import { Appointment } from 'src/database/model/appointment.entity';
import { User } from 'src/database/model/user.entity';
import { Doctor } from 'src/database/model/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Communication, Appointment, User, Doctor]),
    HttpModule,
  ],
  controllers: [CommunicationController],
  providers: [CommunicationService],
  exports: [CommunicationService],
})
export class CommunicationModule {}
