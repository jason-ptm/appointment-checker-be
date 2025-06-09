import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Speciality' })
export class Speciality {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', unique: true })
  name: string;
}
