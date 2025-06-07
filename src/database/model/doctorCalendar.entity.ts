import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Calendar } from './calendar.entity';

@Entity({ name: 'DOCTOR_CALENDAR' })
export class DoctorCalendar {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @ManyToOne(() => DoctorCalendar, (doctorCalendar) => doctorCalendar.idDoctor)
  idDoctor: string;

  @ManyToOne(() => Calendar, (calendar) => calendar.idCalendarDoctor)
  idCalendar: string;
}
