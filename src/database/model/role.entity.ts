import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './userRole.entity';

@Entity({ name: 'Role' })
export class Role {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'key', unique: true })
  key: string;

  @OneToMany(() => UserRole, (role) => role.id)
  idUserRole: string;
}
