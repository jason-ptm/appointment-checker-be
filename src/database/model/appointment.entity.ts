import { APPOINTMENT_STATUS } from 'src/utils/constants';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Doctor } from './doctor.entity';
import { Speciality } from './speciality.entity';
import { User } from './user.entity';
import { Communication } from './communication.entity';

@Entity({ name: 'Appointment' })
export class Appointment {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'appointment_date' })
  appointmentDate: string;

  @Column({ name: 'status', default: APPOINTMENT_STATUS.PENDING })
  status: string;

  @ManyToOne(() => Speciality)
  @JoinColumn({ name: 'id_speciality' })
  speciality: Speciality;

  @Column({ name: 'id_speciality' })
  idSpeciality: string;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'id_doctor' })
  doctor: Doctor;

  @Column({ name: 'id_doctor' })
  idDoctor: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_patient' })
  patient: User;

  @Column({ name: 'id_patient' })
  idPatient: string;

  @OneToMany(() => Communication, (communication) => communication.appointment)
  communications: Communication[];
}
