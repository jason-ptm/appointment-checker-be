import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'SPECIALITY' })
export class Speciality {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'NAME', unique: true })
  name: string;
}
