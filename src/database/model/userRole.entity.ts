import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity({ name: 'User_Role' })
export class UserRole {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'id_user' })
  idUser: string;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn({ name: 'id_role' })
  idRole: string;
}
