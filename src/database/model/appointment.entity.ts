import { APPOINTMENT_STATUS } from 'src/utils/constants';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from './doctor.entity';
import { Speciality } from './speciality.entity';
import { User } from './user.entity';

@Entity({ name: 'Appointment' })
export class Appointment {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'appointment_date' })
  appointmentDate: string;

  @Column({ name: 'status', default: APPOINTMENT_STATUS.PENDING })
  status: string;

  @OneToOne(() => Speciality, (speciality) => speciality.id)
  @JoinColumn({ name: 'id_speciality' })
  idSpeciality: string;

  @OneToOne(() => Doctor, (doctor) => doctor.doctorId)
  @JoinColumn({ name: 'id_doctor' })
  idDoctor: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'id_patient' })
  idPatient: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.id)
  communications: Appointment[];
}
