import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from 'src/database/model/calendar.entity';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar])],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService, TypeOrmModule],
})
export class CalendarModule {}
