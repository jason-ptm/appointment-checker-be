import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from './doctor.entity';
import { Speciality } from './speciality.entity';

@Entity({ name: 'Speciality_Doctor' })
export class SpecialityDoctor {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.doctorId)
  @JoinColumn({ name: 'id_doctor' })
  idDoctor: string;

  @ManyToOne(() => Speciality, (speciality) => speciality.id)
  @JoinColumn({ name: 'id_speciality' })
  idSpeciality: string;
}
