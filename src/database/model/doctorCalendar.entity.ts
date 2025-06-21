import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Calendar } from './calendar.entity';
import { Doctor } from './doctor.entity';

@Entity({ name: 'Doctor_Calendar' })
export class DoctorCalendar {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.doctorId)
  @JoinColumn({ name: 'id_doctor' })
  idDoctor: string;

  @ManyToOne(() => Calendar, (calendar) => calendar.id)
  @JoinColumn({ name: 'id_calendar' })
  idCalendar: string;
}
