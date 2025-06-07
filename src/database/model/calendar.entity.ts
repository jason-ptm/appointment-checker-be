import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DoctorCalendar } from './doctorCalendar.entity';

@Entity({ name: 'CALENDAR' })
export class Calendar {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'STARTDATE' })
  startDate: Date;

  @Column({ name: 'ENDDATE' })
  endDate: Date;

  @ManyToOne(() => DoctorCalendar, (calendar) => calendar.idCalendar)
  idCalendarDoctor: string;
}
