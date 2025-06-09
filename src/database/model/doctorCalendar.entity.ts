import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Calendar } from './calendar.entity';

@Entity({ name: 'Doctor_Calendar' })
export class DoctorCalendar {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => DoctorCalendar, (doctorCalendar) => doctorCalendar.idDoctor)
  @JoinColumn({ name: 'id_doctor' })
  idDoctor: string;

  @ManyToOne(() => Calendar, (calendar) => calendar.idCalendarDoctor)
  @JoinColumn({ name: 'id_calendar' })
  idCalendar: string;
}
