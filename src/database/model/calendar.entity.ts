import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DoctorCalendar } from './doctorCalendar.entity';

@Entity({ name: 'Calendar' })
export class Calendar {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'start_date' })
  startDate: string;

  @Column({ name: 'end_date' })
  endDate: string;

  @Column()
  key: string;

  @OneToMany(() => DoctorCalendar, (calendar) => calendar.idCalendar)
  idCalendarDoctor: string;
}
