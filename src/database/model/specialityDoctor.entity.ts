import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'SpECIALITY_DOCTOR' })
export class SpecialityDoctor {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'ID_SPECIALITY' })
  idSpeciality: string;

  @Column({ name: 'ID_DOCTOR' })
  idDoctor: string;
}
