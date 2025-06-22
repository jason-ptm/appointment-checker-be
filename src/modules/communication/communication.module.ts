import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationService } from './communication.service';
import { CommunicationController } from './communication.controller';
import { Communication } from 'src/database/model/communication.entity';
import { Appointment } from 'src/database/model/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Communication, Appointment])],
  controllers: [CommunicationController],
  providers: [CommunicationService],
  exports: [CommunicationService],
})
export class CommunicationModule {}
