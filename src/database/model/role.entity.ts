import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ROLE' })
export class Role {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'DECRIPTION' })
  description: string;

  @Column({ name: 'KEY', unique: true })
  key: string;
}
