import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'DOCTOR' })
export class Doctor {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;
}
