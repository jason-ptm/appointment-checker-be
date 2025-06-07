import { APPOINTMENT_STATUS } from 'src/utils/constants';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'APPOINTMENT' })
export class Appointment {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'APPOINTMEN_DATE' })
  appointmentDate: Date;

  @Column({ name: 'STATUS', default: APPOINTMENT_STATUS.PENDING })
  status: string;

  @OneToMany(() => User, (user) => user.id)
  idPatient: string;

  @OneToMany(() => Appointment, (appointment) => appointment.id)
  communications: Appointment[];
}
