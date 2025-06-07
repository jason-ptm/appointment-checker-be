import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Speciality } from './speciality.entity';

@Entity({ name: 'SPECIALITY_DOCTOR' })
export class SpecialityDoctor {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @ManyToOne(() => Speciality, (speciality) => speciality.id)
  idSpeciality: string;

  @ManyToOne(
    () => SpecialityDoctor,
    (specialityDoctor) => specialityDoctor.idDoctor,
  )
  idDoctor: string;
}
