import { APPOINTMENT_STATUS } from 'src/utils/constants';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Doctor } from './doctor.entity';
import { Speciality } from './speciality.entity';
import { User } from './user.entity';

@Entity({ name: 'Appointment' })
export class Appointment {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'appointment_date' })
  appointmentDate: string;

  @Column({ name: 'status', default: APPOINTMENT_STATUS.PENDING })
  status: string;

  @ManyToOne(() => Speciality, (speciality) => speciality.id)
  @JoinColumn({ name: 'id_speciality' })
  idSpeciality: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.doctorId)
  @JoinColumn({ name: 'id_doctor' })
  idDoctor: string;

  @ManyToOne(() => User, (patient) => patient.id)
  @JoinColumn({ name: 'id_patient' })
  idPatient: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.id)
  communications: Appointment[];
}
