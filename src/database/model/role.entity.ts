import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './userRole.entity';

@Entity({ name: 'ROLE' })
export class Role {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'DECRIPTION' })
  description: string;

  @Column({ name: 'KEY', unique: true })
  key: string;

  @ManyToOne(() => UserRole, (role) => role.idRole)
  idUserRole: string;
}
