import { Model } from 'sequelize-typescript';
import { Entity, OneToMany } from 'typeorm';
import { DoctorCalendar } from './doctorCalendar.entity';
import { SpecialityDoctor } from './specialityDoctor.entity';

@Entity({ name: 'DOCTOR' })
export class Doctor extends Model {
  @OneToMany(() => DoctorCalendar, (doctorCalendar) => doctorCalendar.idDoctor)
  doctorCalendar: DoctorCalendar[];

  @OneToMany(
    () => SpecialityDoctor,
    (specialityDoctor) => specialityDoctor.idDoctor,
  )
  specialityDoctor: SpecialityDoctor[];
}
