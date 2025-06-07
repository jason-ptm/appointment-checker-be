import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity({ name: 'USER_ROLE' })
export class UserRole {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @OneToMany(() => User, (user) => user.id)
  idUser: string;

  @OneToMany(() => Role, (role) => role.id)
  idRole: string;
}
