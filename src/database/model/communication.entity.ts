import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';

@Entity({ name: 'Communication' })
export class Communication {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'status' })
  status: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.id)
  @JoinColumn({ name: 'id_appointment' })
  idAppointment: string;
}
