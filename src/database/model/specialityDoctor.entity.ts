import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Speciality } from './speciality.entity';

@Entity({ name: 'Speciality_Doctor' })
export class SpecialityDoctor {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => Speciality, (speciality) => speciality.id)
  @JoinColumn({ name: 'id_speciality' })
  idSpeciality: string;

  @ManyToOne(
    () => SpecialityDoctor,
    (specialityDoctor) => specialityDoctor.idDoctor,
  )
  @JoinColumn({ name: 'id_doctor' })
  idDoctor: string;
}
