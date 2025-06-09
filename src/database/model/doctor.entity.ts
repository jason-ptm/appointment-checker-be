import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { DoctorCalendar } from './doctorCalendar.entity';
import { SpecialityDoctor } from './specialityDoctor.entity';
import { User } from './user.entity';

@Entity({ name: 'Doctor' })
export class Doctor {
  @PrimaryColumn({ name: 'id' })
  doctorId: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  userId: string;

  @OneToMany(() => DoctorCalendar, (doctorCalendar) => doctorCalendar.idDoctor)
  doctorCalendar: DoctorCalendar[];

  @OneToMany(
    () => SpecialityDoctor,
    (specialityDoctor) => specialityDoctor.idDoctor,
  )
  specialityDoctor: SpecialityDoctor[];
}
