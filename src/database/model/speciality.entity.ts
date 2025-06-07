import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SpecialityDoctor } from './specialityDoctor.entity';

@Entity({ name: 'SPECIALITY' })
export class Speciality {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'NAME', unique: true })
  name: string;

  @ManyToOne(() => SpecialityDoctor, (speciality) => speciality.idSpeciality)
  idSpecialityDoctor: string;
}
