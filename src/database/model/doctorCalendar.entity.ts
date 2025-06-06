import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'DOCTOR_CALENDAR' })
export class DoctorCalendar {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'ID_DOCTOR' })
  idDoctor: string;

  @Column({ name: 'ID_CALENDAR' })
  idCalendar: string;
}
